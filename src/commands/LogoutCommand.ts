import c from "chalk-template";
import { Command } from "clipanion";
import { config, saveConfig } from "../config";

export default class LogoutCommand extends Command {
  static usage = Command.Usage({
    description: "Delete Gemini API key from config"
  })

  static paths = [["logout"], ["l"]];

  async execute() {
    try {
      delete config.geminiApiKey;
      await saveConfig()
      this.context.stdout.write(c`{green Gemini API key has been deleted successfully!}\n`)
    } catch (_e) {
      const e = _e as Error;
      this.context.stdout.write(c`{red Error deleting Gemini API key:}\n\n${e.message}\n`)
    }
  }
}
