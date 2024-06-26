import chalk from "chalk"
import { Command, Option } from "clipanion"
import ora from "ora"
import GenerativeCommand from "../lib/GenerativeCommand"
import { explainCommandStream } from "../services/explainCommand"
import { config } from "../config"

export default class ExplainCommand extends GenerativeCommand {
  static usage = Command.Usage({
    description: "Get an explanation for a command.",
    details: "The `s explain` command is designed to provide comprehensive explanations for specific CLI commands, aiding users in understanding their usage and functionalities in-depth.",
    examples: [
      ["Get an explanation for the `ls` command.", "s explain \"ls\""],
      ["Get an explanation for the `git status` command.", "s explain \"git status\""],
    ],
  })

  static paths = [["explain"], ["e"]]

  command = Option.String({ required: true })

  async execute() {
    this.assertGeminiKey()

    const spinner = ora().start()

    const command = this.command
    const ci = config.customInstructions
    const cmdStream = await explainCommandStream(command, ci)
    spinner.stop()

    await this.writeStream(cmdStream, chunk => chalk.cyan(chunk))
  }
}
