import chalk from "chalk"
import { Command, Option } from "clipanion"
import ora from "ora"
import { input } from "@inquirer/prompts"
import GenerativeCommand from "../lib/GenerativeCommand"
import { config } from "../config"
import { reviseCommandStream } from "../services/reviseCommand"

export default class ReviseCommand extends GenerativeCommand {
  static usage = Command.Usage({
    description: "Revise a command.",
    details: "The `s revise` command is designed to start directly a revision for a command. This enables you to tailor the command to your specific needs before execution.",
    examples: [
      ["Start a revision for the `ls` command.", "s revise \"ls\""],
      ["Start a revision for the `git log` command.", "s revise \"git log\""],
    ],
  })

  static paths = [["revise"], ["r"]]

  command = Option.String({ required: true })

  async execute() {
    this.assertGeminiKey()

    const revisePrompt = await input({
      message: "Enter your revision",
    })
    const spinner = ora().start()

    const cmd = this.command
    const ci = config.customInstructions
    const query = "[null]"
    const cmdStream = await reviseCommandStream(query, cmd, revisePrompt, ci)
    spinner.stop()

    const revisedCmd = await this.writeStream(cmdStream, chunk => chalk.cyan(chunk))

    this.respond(query, revisedCmd)
  }
}
