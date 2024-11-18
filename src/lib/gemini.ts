import { GoogleGenerativeAI } from "@google/generative-ai"
import { config } from "../config"

let genAI: GoogleGenerativeAI

export function getGemini(systemInstruction?: string) {
  if (!genAI) {
    const GEMINI_API_KEY = config.geminiApiKey || Bun.env.S_GEMINI_API_KEY

    if (!GEMINI_API_KEY)
      throw new Error("Gemini API key not set")

    genAI = new GoogleGenerativeAI(GEMINI_API_KEY!)
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction,
  })

  return model
}
