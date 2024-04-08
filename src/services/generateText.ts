import { getGemini } from "../gemini"

export async function generateTextStream(input: string) {
  const gemini = getGemini()

  const prompt = input

  const result = await gemini.generateContentStream(prompt)
  return result.stream
}
