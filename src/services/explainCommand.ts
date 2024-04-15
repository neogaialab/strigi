import process from "node:process"
import { getGemini } from "../gemini"
import type { CustomInstructions } from "../types"

export async function explainCommandStream(
  cmd: string,
  ci?: CustomInstructions,
) {
  const gemini = getGemini()

  let prompt = `
    You are a CLI command generator. You are expected to explain a command based on user's query and information. Additionally, you should adapt your explanation based on the user's response preference.
    
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

  if (ci?.responsePreference) {
    prompt += `
    ## How would the user like you to respond
    
    ${ci.responsePreference}
  `
  }

  prompt += `
    ## Command

    ${cmd}

    ## Output Criteria

    - A complete plain text

    ## Output Example

    \`ls\` is a command used to list files in the current directory. It can be used with various options to specify how the files are listed, such as \`-a\` to show hidden files or \`-l\` to show detailed information about each file.
  `

  const result = await gemini.generateContentStream(prompt)
  return result.stream
}
