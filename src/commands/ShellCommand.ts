import { exec } from "node:child_process"
import { confirm, input, select } from "@inquirer/prompts"
import chalk from "chalk"
import { Command, Option } from "clipanion"
import ora from "ora"
import c from "chalk-template"
import { explainCommandStream } from "../services/explainCommand"
import { generateCommandStream } from "../services/generateCommand"
import { reviseCommandStream } from "../services/reviseCommand"
import GenerativeCommand from "../lib/GenerativeCommand"

type Actions = "run" | "cancel" | "explain" | "revise"

export default class ShellCommand extends GenerativeCommand {
  static usage = Command.Usage({
    description: "Generate a command based on the prompt",
  })

  static paths = [["shell"], ["s"]]
  prompt = Option.Rest({ name: "prompt", required: 1 })

  explanation: string | null = null

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

      const explanationStream = await explainCommandStream(query, cmd)
      spinner.stop()

      this.explanation = await this.writeStream(explanationStream)

      await this.respond(query, cmd, { refreshCmd: true })
    }

    const revise = async () => {
      const revisePrompt = await input({
        message: "Enter your revision",
      })
      const spinner = ora().start()

      const reviseStream = await reviseCommandStream(query, cmd, revisePrompt)
      spinner.stop()

      const revisedCmd = await this.writeStream(reviseStream, chunk => chalk.blue(chunk))

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
    this.assertGeminiKey()

    const spinner = ora().start()

    const query = this.prompt.join(" ")
    const cmdStream = await generateCommandStream(query)
    spinner.stop()

    const cmd = await this.writeStream(cmdStream, chunk => chalk.blue(chunk))

    this.respond(query, cmd)
  }
}
