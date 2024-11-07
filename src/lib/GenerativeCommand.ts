import { exec } from "node:child_process"
import process from "node:process"
import type { EnhancedGenerateContentResponse } from "@google/generative-ai"
import { confirm, input, select } from "@inquirer/prompts"
import chalk from "chalk"
import c from "chalk-template"
import { Command } from "clipanion"
import ora, { type Ora } from "ora"
import { config } from "../config"
import { explainCommandStream } from "../services/explainCommand"
import { reviseCommandStream } from "../services/reviseCommand"
import { checkResponse } from "../services/checkResponse"
import { getGemini } from "./gemini"

type Actions = "run" | "cancel" | "explain" | "revise" | "retry"
type Choices = Parameters<typeof select<Actions>>[0]["choices"]
type TryAsyncCallback = (spinner: Ora) => Promise<void> | void
interface RespondOptions {
  refreshCmd?: boolean
  enableRetry?: boolean
}

abstract class GenerativeCommand extends Command {
  explanation: string | null = null

  async assertGeminiKey() {
    try {
      getGemini()
    }
    catch (e) {
      this.context.stdout.write(c`{red Gemini API key not set.}\n`)
      process.exit(1)
    }
  }

  async writeStream(
    stream: AsyncGenerator<EnhancedGenerateContentResponse>,
    cb?: (chunk: string) => string,
  ) {
    let text = ""
    this.context.stdout.write(cb ? cb("\n") : "\n")

    for await (const chunk of stream) {
      const chunkText = chunk.text()
      this.context.stdout.write(cb ? cb(chunkText) : chunkText)
      text += chunkText
    }

    this.context.stdout.write(cb ? cb("\n\n") : "\n\n")

    return text
  }

  async revise(cmd: string, previousQuery?: string) {
    const revisePrompt = await input({
      message: "Enter your revision",
    })

    const ci = config.customInstructions
    const query = previousQuery || "[null]"

    this.tryAsync(async (spinner) => {
      const result = await reviseCommandStream(query, cmd, revisePrompt, ci)
      spinner.stop()
      const stream = await checkResponse(result)
      const revisedCmd = await this.writeStream(stream, chunk => chalk.cyan(chunk))

      this.respond(query, revisedCmd, { refreshCmd: false })
    }, {
      onError: () => {
        this.respond(query, cmd, { refreshCmd: false, enableRetry: true })
      },
    })
  }

  async explain(cmd: string, previousQuery?: string) {
    const query = previousQuery || "[null]"

    await this.tryAsync(async (spinner) => {
      const result = await explainCommandStream(cmd, config.customInstructions)
      spinner.stop()
      const stream = await checkResponse(result)

      this.explanation = await this.writeStream(stream, chunk => chalk.cyan(chunk))
    }, {
      onError: () => {
        this.respond(query, cmd, { refreshCmd: false, enableRetry: true })
      },
    })
  }

  async respond(query: string, cmd: string, options?: RespondOptions) {
    if (options?.refreshCmd)
      this.context.stdout.write(chalk.cyan(`${cmd}\n\n`))

    const choices: Choices = [
      {
        name: !options?.enableRetry ? "Run (1)" : "Retry (1)",
        value: !options?.enableRetry ? "run" : "retry",
      },
      {
        name: "Revise (2)",
        value: "revise",
        disabled: options?.enableRetry,
      },
      {
        name: !this.explanation ? "Explain (3)" : "Explain again (3)",
        value: "explain",
        disabled: options?.enableRetry,
      },
      {
        name: "Cancel (4)",
        value: "cancel",
      },
    ]

    const action = await select<Actions>({
      message: "",
      choices,
    })

    const cancel = async () => {
      this.context.stdout.write(c`{yellow Canceled.}\n\n`)

      if (options?.enableRetry)
        process.exit(0)

      await this.respond(query, cmd, { refreshCmd: true })
    }

    const run = async () => {
      const answer = await confirm({
        message: "Are you sure you want to run?",
        default: true,
      })

      if (answer) {
        this.context.stdout.write(c`\n{green Executing...}\n`)

        await new Promise<void>((res) => {
          exec(cmd, (e, stdout, stderr) => {
            if (e instanceof Error) {
              this.context.stdout.write(c`{red Encountered an error: }\n\n${stderr}`)
              return
            }

            this.context.stdout.write(`\n${stdout}`)
            res()
          })
        })

        return
      }

      cancel()
    }

    const retry = () => {
      this.context.stdout.write(c`{yellow Retrying...}\n`)
      this.execute()
    }

    const actions: Record<typeof action, () => Promise<void> | void> = {
      run,
      cancel,
      explain: () => this.explain(cmd, query),
      revise: () => this.revise(cmd, query),
      retry,
    }
    const handle = actions[action]!

    await handle()
  }

  async tryAsync(cb: TryAsyncCallback, options?: { onError: (e: Error) => void }) {
    const spinner = ora().start()

    try {
      await cb(spinner)
    }
    catch (_e) {
      const e = _e as Error

      spinner.stop()

      this.context.stdout.write(c`\n{red Error: ${e.message}}\n\n`)
      options?.onError(e)
    }
  }
}

export default GenerativeCommand
