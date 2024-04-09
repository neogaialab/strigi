import { Command, Option } from "clipanion"
import GenerativeCommand from "../lib/GenerativeCommand"
import ExplainCommand from "./ExplainCommand"

export default class MainCommand extends GenerativeCommand {
  static usage = Command.Usage({
    description: "Get CLI command assistance based on a prompt.",
    details: `The \`main\` command is a versatile shortcut that combines the functionality of \`s run\` and \`s explain\` commands with the -e flag. It allows you to execute a shell command directly or obtain an explanation for a specific command in natural language.`,
    examples: [
      ["Generate a command to list only JSON files.", "s \"how to list JSON files\""],
      ["Get an explanation for the `git status` command.", "s explain \"git status\""],
    ],
  })

  isExplain = Option.Boolean("-e, --explain", { description: ExplainCommand.usage.description })
  prompt = Option.Rest({ name: "prompt", required: 1 })

  async execute() {
    this.assertGeminiKey()

    if (this.isExplain) {
      this.cli.run(["explain", ...this.prompt])
      return
    }

    this.cli.run(["run", ...this.prompt])
  }
}
