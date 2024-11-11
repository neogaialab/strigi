import c from "chalk-template"
import { Command } from "clipanion"
import { config, saveConfig } from "../config"
import StrigiCommand from "../lib/StrigiCommand"

export default class LogoutCommand extends StrigiCommand {
  static usage = Command.Usage({
    description: "Log out and remove Gemini API key.",
    details: `The \`logout\` command securely removes the Gemini API key from the configuration, enhancing access control and security measures.`,
    category: "Authentication",
  })

  static paths = [["logout"], ["l"]]

  async execute() {
    try {
      delete config.geminiApiKey
      await saveConfig()
      this.context.stdout.write(c`{green Gemini API key has been deleted successfully!}\n`)
    }
    catch (_e) {
      const e = _e as Error
      this.context.stdout.write(c`{red Error deleting Gemini API key:}\n\n${e.message}\n`)
    }
  }
}
