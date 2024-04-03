import { confirm, input, select } from "@inquirer/prompts"
import chalk from "chalk"
import c from "chalk-template"
import { Command, Option } from "clipanion"
import ora from "ora"
import type { EnhancedGenerateContentResponse } from "@google/generative-ai"
import pkg from "../../package.json"
import { getGemini } from "../gemini"
import { explainCommandStream } from "../services/explainCommand"
import { generateCommandStream } from "../services/generateCommand"
import { reviseCommandStream } from "../services/reviseCommand"

type Actions = "run" | "cancel" | "explain" | "revise"

export default class MainCommand extends Command {
  static usage = Command.Usage({
    description: pkg.description,
  })

  query = Option.Rest({ name: "query", required: 1 })

  explanation: string | null = null

  async stream(stream: AsyncGenerator<EnhancedGenerateContentResponse>, cb?: (chunk: string) => string) {
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
      this.context.stdout.write(chalk.blue(`${cmd}\n\n`))

    const action = await select<Actions>({
      message: "",
      choices: [
        {
          name: "Run",
          value: "run",
        },
        {
          name: "Revise",
          value: "revise",
        },
        {
          name: !this.explanation ? "Explain" : "Explain again",
          value: "explain",
        },
        {
          name: "Cancel",
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

        const cmdArray = cmd.split(" ")
        const label = cmdArray[0]

        const commandPath = Bun.which(label)

        if (!commandPath) {
          this.context.stdout.write(c`{red Command not found in PATH}\n`)
          return
        }

        const res = Bun.spawnSync(cmdArray)

        if (!res.success) {
          this.context.stdout.write(c`{red Command failed with exit code ${res.exitCode}. }\n\n${res.stderr}`)
          return
        }

        this.context.stdout.write(`\n${res.stdout}`)
        return
      }

      cancel()
    }

    const explain = async () => {
      const spinner = ora().start()

      const explanationStream = await explainCommandStream(query, cmd)
      spinner.stop()

      this.explanation = await this.stream(explanationStream)

      await this.respond(query, cmd, { refreshCmd: true })
    }

    const revise = async () => {
      const revisePrompt = await input({
        message: "Enter your revision",
      })
      const spinner = ora().start()

      const reviseStream = await reviseCommandStream(query, cmd, revisePrompt)
      spinner.stop()

      const revisedCmd = await this.stream(reviseStream, chunk => chalk.blue(chunk))

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

  async execute() {
    try {
      getGemini()
    }
    catch (e) {
      this.context.stdout.write(c`{red Gemini API key not set.}\n`)
      return
    }

    const spinner = ora().start()

    const query = this.query.join(" ")
    const cmdStream = await generateCommandStream(query)
    spinner.stop()

    const cmd = await this.stream(cmdStream, chunk => chalk.blue(chunk))

    this.respond(query, cmd)
  }
}
