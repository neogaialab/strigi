import { Command, Option } from "clipanion"
import GenerativeCommand from "../lib/GenerativeCommand"

export default class MainCommand extends GenerativeCommand {
  static usage = Command.Usage({
    description: "Generate content based on prompt",
  })

  isShell = Option.Boolean("-s, --shell", { description: "Generate commands based on prompts" })
  prompt = Option.Rest({ name: "prompt", required: 1 })

  async execute() {
    this.assertGeminiKey()

    if (this.isShell) {
      this.cli.run(["shell", ...this.prompt])
      return
    }

    this.cli.run(["get-assistance", ...this.prompt])
  }
}
