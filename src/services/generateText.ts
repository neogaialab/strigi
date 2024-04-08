import { getGemini } from "../gemini"

export async function generateTextStream(query: string) {
  const gemini = getGemini()

  const prompt = query

  const result = await gemini.generateContentStream(prompt)
  return result.stream
}
