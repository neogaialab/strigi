import process from "node:process"
import { getGemini } from "../lib/gemini"
import type { CustomInstructions } from "../types"

export async function reviseCommandStream(
  query: string,
  cmd: string,
  revise: string,
  ci?: CustomInstructions,
) {
  let systemInstructions = `You are a CLI command generator. You are expected to revise a command that you have generated based on user query and user's information, but now with a new input (Revise Prompt). Don't give an explanation for the command.

## About the user
    
OS Platform: ${process.platform}
`

  if (ci?.aboutMe) {
    systemInstructions += `
    ${ci.aboutMe}
    `
  }

  systemInstructions += `
  ## Output Criteria
    
  - A complete valid CLI command
  - A complete plain text
  
  ## Output Example
  
  git commit --amend
  `

  const prompt = `
    ## Initial Query
    
    ${query}

    ## Proposed Command

    ${cmd}

    ## Revise Prompt
    
    ${revise}
  `

  const gemini = getGemini(systemInstructions)
  const result = await gemini.generateContentStream(prompt)
  return result
}
