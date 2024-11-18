import chalk from "chalk"
import { Command, Option } from "clipanion"
import { config } from "../config"
import GenerativeCommand from "../lib/GenerativeCommand"
import { checkResponse } from "../services/checkResponse"
import { generateCommand } from "../services/generateCommand"

export default class GenerateCommand extends GenerativeCommand {
  static usage = Command.Usage({
    description: "Generate and execute commands from natural language prompts.",
    details: `The \`s generate\` command is designed to interpret natural language prompts and generate corresponding CLI commands. It then offers the option to revise the generated command before execution.`,
    examples: [
      ["Generate and execute a command to list files.", "s generate \"list files in current directory\""],
      ["Generate and execute a command to update packages.", "s generate \"update all packages\""],
    ],
  })

  static paths = [["generate"], ["g"]]
  prompt = Option.Rest({ name: "prompt", required: 1 })

  explanation: string | null = null

  async execute() {
    this.assertGeminiKey()

    const query = this.prompt.join(" ")
    const ci = config.customInstructions

    this.tryAsync(async (spinner) => {
      const result = await generateCommand(query, ci)
      spinner.stop()

      const cmd = await this.writeStream(result.stream, chunk => chalk.cyan(chunk))
      checkResponse(await result.response)

      this.respond(query, cmd)
    }, {
      onError: () => {
        this.respond(query, "[null]", { refreshCmd: false, enableRetry: true })
      },
    })
  }
}
