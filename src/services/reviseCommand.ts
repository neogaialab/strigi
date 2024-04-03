import { getGemini } from "../gemini";

export async function reviseCommandStream(query: string, cmd: string, revise: string) {
  const gemini = getGemini()

  const prompt = `
    You are a CLI command generator. You are expected to revise a command that you have generated based on user query, but now with a new input (Revise Prompt).

    ## Initial Query

    <#region Input>
    ${query}
    </#regionend>

    ## Proposed Command

    <#region Command>
    ${cmd}
    </#regionend>

    ## Revise Prompt

    <#region Revise>
    ${revise}
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
