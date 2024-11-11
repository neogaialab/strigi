import { input } from "@inquirer/prompts"
import c from "chalk-template"
import { Command } from "clipanion"
import { config, saveConfig } from "../config"
import type { CustomInstructions } from "../types"
import StrigiCommand from "../lib/StrigiCommand"

export default class InstructCommand extends StrigiCommand {
  static usage = Command.Usage({
    description: "Add custom instructions for tailored responses.",
    details: `The \`s instruct\` command empowers you to provide specific guidelines or preferences to the model for more tailored and accurate responses. Your custom instructions will be integrated into future interactions with the model.`,
    category: "Configuration",
  })

  static paths = [["instruct"], ["i"]]

  async saveCustomInstructions(ci: CustomInstructions) {
    try {
      config.customInstructions = ci
      await saveConfig()
      this.context.stdout.write(c`{green Custom instructions set successfully!}\n`)
    }
    catch (_e) {
      const e = _e as Error
      this.context.stdout.write(c`{red Error saving custom instructions:}\n\n${e.message}\n`)
    }
  }

  async execute() {
    const aboutMe = await input({
      message: "What would you like the model to know about you to provide better responses?",
      default: config.customInstructions?.aboutMe,
    })

    const responsePreference = await input({
      message: "How would you like the model to respond?",
      default: config.customInstructions?.responsePreference,
    })

    this.saveCustomInstructions({
      aboutMe,
      responsePreference,
    })
  }
}
