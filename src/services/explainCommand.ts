import process from "node:process"
import { getGemini } from "../lib/gemini"
import type { CustomInstructions } from "../types"

export async function explainCommandStream(
  cmd: string,
  ci?: CustomInstructions,
) {
  let systemInstructions = `
    You are a CLI command generator. You are expected to explain a command based on user's query and information. Additionally, you should adapt your explanation based on the user's response preference.
    
    ## Output Criteria

    - A complete plain text

    ## Output Example

    \`ls\` is a command used to list files in the current directory. It can be used with various options to specify how the files are listed, such as \`-a\` to show hidden files or \`-l\` to show detailed information about each file.
  `
  systemInstructions += `
  ## About the user
  
  OS Platform: ${process.platform}
  `

  if (ci?.aboutMe) {
    systemInstructions += `
    ${ci.aboutMe}
    `
  }

  if (ci?.responsePreference) {
    systemInstructions += `
    ## How would the user like you to respond
    
    ${ci.responsePreference}
    `
  }

  const gemini = getGemini(systemInstructions)

  const prompt = `
  ## Command
  
  ${cmd}
  `

  const result = await gemini.generateContentStream(prompt)
  return result
}
