import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai";
import { config } from "./config";

let gemini: GenerativeModel;

export function getGemini() {
  if(!gemini) {
    const GEMINI_API_KEY = config.geminiApiKey || Bun.env.S_GEMINI_API_KEY

    if(!GEMINI_API_KEY) {
      throw new Error('Gemini API key not set')
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    gemini = genAI.getGenerativeModel({ model: "gemini-pro" });
  }
  
  return gemini;
}
