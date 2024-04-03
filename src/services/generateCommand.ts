import { gemini } from "../main";

export type CommandGeneration = {
  command: string
};

async function generateCommand(query: string) {
  const prompt = `
    You are a CLI command generator. You are expected to generate a command from user's query (input).

    ## Input

    <#region Input>
    ${query}
    </#regionend>

    ## Output Criteria

    - A complete valid JSON
    - Follow exactly the output format

    ## Output Format

    {
      "command": string
    }

    ## Output Example

    {
      "command": "git commit --amend"
    }
  `

  const result = await gemini.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  const data = JSON.parse(text) as CommandGeneration
  return data;
}

export default generateCommand;
