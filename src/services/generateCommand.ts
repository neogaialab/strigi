import { getGemini } from "../gemini"
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

  if (ci?.aboutMe) {
    prompt += `
    ## About the user
    
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
