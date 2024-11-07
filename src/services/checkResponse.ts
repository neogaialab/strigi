import { FinishReason, type GenerateContentStreamResult } from "@google/generative-ai"

export async function checkResponse(result: GenerateContentStreamResult) {
  const res = await result.response
  const finishReason = res.candidates?.[0]?.finishReason

  if (finishReason !== FinishReason.STOP)
    throw new Error(`The response could not be completed due to the following reason: ${finishReason}`)

  return result.stream
}
