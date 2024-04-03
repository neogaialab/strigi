import { gemini } from "../main";

export type CommandGeneration = {
  cmd: string
};

async function generateCommand(query: string) {
  const prompt = `
    You are a CLI command generator. You are expected to generate a command from user query (input). Additionally, you need to provide the explanation for that command.

    ## Input

    <#region Input>
    ${query}
    </#regionend>

    ## Output Criteria

    - A complete valid JSON
    - Follow exactly the output format

    ## Output Format

    {
      "cmd": string
    }

    ## Output Example

    {
      "cmd": "git commit --amend"
    }
  `

  const result = await gemini.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  const data = JSON.parse(text) as CommandGeneration
  return data;
}

export default generateCommand;
