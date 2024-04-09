import { getGemini } from "../gemini"
import type { CustomInstructions } from "../types"

export async function explainCommandStream(
  query: string,
  cmd: string,
  ci?: CustomInstructions,
) {
  const gemini = getGemini()

  let prompt = `
    You are a CLI command generator. You are expected to explain a command that you generated based on user's query and information. Additionally, consider adapting your revised command based on the user's response preference, if necessary.

    ## User Query

    ${query}
  `

  if (ci?.aboutMe) {
    prompt += `
    ## About the user
    
    ${ci.aboutMe}
  `
  }

  if (ci?.responsePreference) {
    prompt += `
    ## How would the user like the model to respond
    
    ${ci.responsePreference}
  `
  }

  prompt += `
    ## Your Command

    ${cmd}

    ## Output Criteria

    - A complete plain text

    ## Output Example

    \`ls\` is a command used to list files in the current directory. It can be used with various options to specify how the files are listed, such as \`-a\` to show hidden files or \`-l\` to show detailed information about each file.
  `

  const result = await gemini.generateContentStream(prompt)
  return result.stream
}
