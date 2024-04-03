import { password } from "@inquirer/prompts";
import c from "chalk-template";
import { Command, Option } from "clipanion";
import { config, saveConfig } from "../config";

export default class AuthCommand extends Command {
  static usage = Command.Usage({
    description: "Authenticate"
  })

  static paths = [["auth"], ["a"]];

  geminiApiKey = Option.String('-g, --gemini', { description: 'Gemini API key to use' })

  async saveGeminiApiKey(geminiApiKey: string) {
    try {
      config.geminiApiKey = geminiApiKey;
      await saveConfig()
      this.context.stdout.write(c`{green Gemini API key set successfully!}\n`)
    } catch (_e) {
      const e = _e as Error;
      this.context.stdout.write(c`{red Error saving Gemini API key:}\n\n${e.message}\n`)
    }
  }

  async execute() {
    if (this.geminiApiKey) {
      this.saveGeminiApiKey(this.geminiApiKey)
      return;
    }

    const answer = await password({
      message: "Enter the Gemini API key"
    })

    this.saveGeminiApiKey(answer)
  }
}
