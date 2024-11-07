import { Command, Option } from "clipanion"
import GenerativeCommand from "../lib/GenerativeCommand"

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

  command = Option.Rest({ required: 1 })

  async execute() {
    this.assertGeminiKey()
    await this.revise(this.command.join(" "))
  }
}
