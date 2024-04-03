import { getGemini } from "../gemini";

async function generateCommand(query: string) {
  const gemini = getGemini()

  const prompt = `
    You are a CLI command generator. You are expected to generate a command from user query (input).

    ## Input

    <#region Input>
    ${query}
    </#regionend>

    ## Output Criteria

    - A complete valid CLI command
    - A complete plain text

    ## Output Example

    git commit --amend
  `

  const result = await gemini.generateContentStream(prompt);
  return result.stream;
}

export default generateCommand;
