import process from "node:process"
import { exec } from "node:child_process"
import type { EnhancedGenerateContentResponse } from "@google/generative-ai"
import { Command } from "clipanion"
import c from "chalk-template"
import { confirm, input, select } from "@inquirer/prompts"
import chalk from "chalk"
import ora from "ora"
import { explainCommandStream } from "../services/explainCommand"
import { reviseCommandStream } from "../services/reviseCommand"
import { config } from "../config"
import { getGemini } from "./gemini"

type Actions = "run" | "cancel" | "explain" | "revise"

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

  async respond(query: string, cmd: string, options?: { refreshCmd: boolean }) {
    if (options?.refreshCmd)
      this.context.stdout.write(chalk.cyan(`${cmd}\n\n`))

    const action = await select<Actions>({
      message: "",
      choices: [
        {
          name: "Run (1)",
          value: "run",
        },
        {
          name: "Revise (2)",
          value: "revise",
        },
        {
          name: !this.explanation ? "Explain (3)" : "Explain again (3)",
          value: "explain",
        },
        {
          name: "Cancel (4)",
          value: "cancel",
        },
      ],
    })

    const cancel = () => {
      this.context.stdout.write(c`{yellow Canceled.}\n`)
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

    const explain = async () => {
      const spinner = ora().start()

      const ci = config.customInstructions
      const explanationStream = await explainCommandStream(cmd, ci)
      spinner.stop()

      this.explanation = await this.writeStream(explanationStream)

      await this.respond(query, cmd, { refreshCmd: true })
    }

    const revise = async () => {
      const revisePrompt = await input({
        message: "Enter your revision",
      })
      const spinner = ora().start()

      const ci = config.customInstructions
      const reviseStream = await reviseCommandStream(query, cmd, revisePrompt, ci)
      spinner.stop()

      const revisedCmd = await this.writeStream(reviseStream, chunk => chalk.cyan(chunk))

      await this.respond(revisePrompt, revisedCmd, { refreshCmd: false })
    }

    const actions: Record<typeof action, () => Promise<void> | void> = {
      run,
      cancel,
      explain,
      revise,
    }
    const handle = actions[action]!

    await handle()
  }
}

export default GenerativeCommand
