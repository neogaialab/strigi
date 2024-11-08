import { type EnhancedGenerateContentResponse, FinishReason, type GenerateContentStreamResult } from "@google/generative-ai"

export async function checkResponse(result: GenerateContentStreamResult) {
  const res = await result.response
  const finishReason = res.candidates?.[0]?.finishReason

  if (finishReason !== FinishReason.STOP)
    throw new Error(`The response could not be completed due to the following reason: ${finishReason}`)

  return result.stream
}

export function checkResponseStream(chunk: EnhancedGenerateContentResponse) {
  const finishReason = chunk.candidates?.[0]?.finishReason

  if (finishReason && finishReason !== FinishReason.STOP)
    throw new Error(`The next response chunk could not be completed due to the following reason: ${finishReason}`)

  return chunk.text()
}
