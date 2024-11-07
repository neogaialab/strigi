import { Command, Option } from "clipanion"
import GenerativeCommand from "../lib/GenerativeCommand"

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

  command = Option.Rest({ required: 1 })

  async execute() {
    this.assertGeminiKey()
    await this.explain(this.command.join(" "))
  }
}
