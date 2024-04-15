import process from "node:process"
import { getGemini } from "../lib/gemini"
import type { CustomInstructions } from "../types"

export async function generateCommandStream(
  query: string,
  ci?: CustomInstructions,
) {
  const gemini = getGemini()

  let prompt = `
    You are a CLI command generator. You are expected to generate a command based on user's query and information. It is important to only generate the command without explanation.

    ## Input

    ${query}

  `

  prompt += `
    ## About the user

    OS Platform: ${process.platform}
  `

  if (ci?.aboutMe) {
    prompt += `
    ${ci.aboutMe}
  `
  }

  prompt += `
    ## Output Criteria

    - A complete valid CLI command
    - A complete plain text

    ## Output Example

    git commit --amend
  `

  const result = await gemini.generateContentStream(prompt)
  return result.stream
}
