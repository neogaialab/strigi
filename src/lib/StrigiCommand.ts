import c from "chalk-template"
import { Command } from "clipanion"

abstract class StrigiCommand extends Command {
  async catch(error: any): Promise<void> {
    this.context.stdout.write(c`{red Error: ${error.message}}\n`)
  }
}

export default StrigiCommand
