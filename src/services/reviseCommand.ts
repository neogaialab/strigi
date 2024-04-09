import { getGemini } from "../gemini"
import type { CustomInstructions } from "../types"

export async function reviseCommandStream(
  query: string,
  cmd: string,
  revise: string,
  ci?: CustomInstructions,
) {
  const gemini = getGemini()

  let prompt = `
    You are a CLI command generator. You are expected to revise a command that you have generated based on user query and user's information, but now with a new input (Revise Prompt). It is important to only generate the command without explanation.

  `

  if (ci?.aboutMe) {
    prompt += `
    ## About the user
    
    ${ci.aboutMe}
  `
  }

  prompt += `
    ## Initial Query

    ${query}

    ## Proposed Command

    ${cmd}

    ## Revise Prompt

    ${revise}

    ## Output Criteria

    - A complete valid CLI command
    - A complete plain text

    ## Output Example

    git commit --amend
  `

  const result = await gemini.generateContentStream(prompt)
  return result.stream
}
