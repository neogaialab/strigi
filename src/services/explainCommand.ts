import { getGemini } from "../gemini"

export async function explainCommandStream(query: string, cmd: string) {
  const gemini = getGemini()

  const prompt = `
    You are a CLI command generator. You are expected to explain a command that you generated based on user's query.

    ## User Query

    ${query}

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
