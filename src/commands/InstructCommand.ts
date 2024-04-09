import { input } from "@inquirer/prompts"
import c from "chalk-template"
import { Command } from "clipanion"
import { config, saveConfig } from "../config"
import type { CustomInstructions } from "../types"

export default class InstructCommand extends Command {
  static usage = Command.Usage({
    description: "Add custom instructions to the model",
    details: ` Custom instructions allow you to share anything you'd like the model to consider in its response. Your custom instructions will be added to new commands going forward.`,
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
