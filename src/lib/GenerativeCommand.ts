import process from "node:process"
import type { EnhancedGenerateContentResponse } from "@google/generative-ai"
import { Command } from "clipanion"
import c from "chalk-template"
import { getGemini } from "../gemini"

abstract class GenerativeCommand extends Command {
  async assertGeminiKey() {
    try {
      getGemini()
    }
    catch (e) {
      this.context.stdout.write(c`{red Gemini API key not set.}\n`)
      process.exit(1)
    }
  }

  async writeStream(
    stream: AsyncGenerator<EnhancedGenerateContentResponse>,
    cb?: (chunk: string) => string,
  ) {
    let text = ""
    this.context.stdout.write(cb ? cb("\n") : "\n")

    for await (const chunk of stream) {
      const chunkText = chunk.text()
      this.context.stdout.write(cb ? cb(chunkText) : chunkText)
      text += chunkText
    }

    this.context.stdout.write(cb ? cb("\n\n") : "\n\n")

    return text
  }
}

export default GenerativeCommand
