import { getGemini } from "../gemini"
import type { CustomInstructions } from "../types"

export async function generateAssistanceStream(
  input: string,
  ci?: CustomInstructions,
) {
  const gemini = getGemini()

  let prompt = `
    You are a CLI assistant. You are expected to generate a response based on user input.\n
  `

  if (ci?.aboutMe) {
    prompt += "## About Me\n\n"
    prompt += `${ci.aboutMe}\n\n`
  }
  if (ci?.responsePreference) {
    prompt += "## Response Preference\n\n"
    prompt += `${ci.responsePreference}\n\n`
  }

  prompt += `
    ## Input

    ${input}
  `

  const result = await gemini.generateContentStream(prompt)
  return result.stream
}
