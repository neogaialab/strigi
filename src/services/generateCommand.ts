import process from "node:process"
import { getGemini } from "../lib/gemini"
import type { CustomInstructions } from "../types"

export async function generateCommand(
  query: string,
  ci?: CustomInstructions,
) {
  const systemInstruction = `You are a CLI command generator. You receive a query and respond with a valid CLI command based on that query and user information. Don't give an explanation for the command.

  You have to generate a command for workstation OS platform: ${process.platform}
  
Your response must be plain text. For example:
  
git commit --amend
  `

  const gemini = getGemini(systemInstruction)

  let prompt = ``

  if (ci?.aboutMe) {
    prompt += `Here is some information about me:

    ## About Me

    ${ci.aboutMe}
    `
  }

  prompt += `
    ---

    Here is the query you need to generate a command for:
    
    ## Query

    ${query}
  `

  return gemini.generateContentStream(prompt)
}
