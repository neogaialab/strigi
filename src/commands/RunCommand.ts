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
import { config } from "../config"

type Actions = "run" | "cancel" | "explain" | "revise"

export default class RunCommand extends GenerativeCommand {
  static usage = Command.Usage({
    description: "Generate and execute commands from natural language prompts.",
    details: `The \`s run\` command is designed to interpret natural language prompts and generate corresponding CLI commands. It then offers the option to revise the generated command before execution.`,
    examples: [
      ["Generate and execute a command to list files.", "s generate \"list files in current directory\" -e"],
      ["Generate and execute a command to update packages.", "s generate \"update all packages\" -e"],
    ],
  })

  static paths = [["run"], ["r"]]
  prompt = Option.Rest({ name: "prompt", required: 1 })

  explanation: string | null = null

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

  async execute() {
    this.assertGeminiKey()

    const spinner = ora().start()

    const query = this.prompt.join(" ")
    const ci = config.customInstructions
    const cmdStream = await generateCommandStream(query, ci)
    spinner.stop()

    const cmd = await this.writeStream(cmdStream, chunk => chalk.cyan(chunk))

    this.respond(query, cmd)
  }
}
