import { Command, Option } from "clipanion"
import GenerativeCommand from "../lib/GenerativeCommand"
import ExplainCommand from "./ExplainCommand"

export default class MainCommand extends GenerativeCommand {
  static usage = Command.Usage({
    description: "Generate content based on prompt",
  })

  isExplain = Option.Boolean("-e, --explain", { description: ExplainCommand.usage.description })
  prompt = Option.Rest({ name: "prompt", required: 1 })

  async execute() {
    this.assertGeminiKey()

    if (this.isExplain) {
      this.cli.run(["explain", ...this.prompt])
      return
    }

    this.cli.run(["shell", ...this.prompt])
  }
}
