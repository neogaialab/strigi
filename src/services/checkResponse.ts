import { type EnhancedGenerateContentResponse, FinishReason } from "@google/generative-ai"

export async function checkResponse(res: EnhancedGenerateContentResponse) {
  const finishReason = res.candidates?.[0]?.finishReason

  if (finishReason && finishReason !== FinishReason.STOP)
    throw new Error(`The response could not be completed due to the following reason: ${finishReason}`)
}

export function checkResponseStream(chunk: EnhancedGenerateContentResponse) {
  const finishReason = chunk.candidates?.[0]?.finishReason

  if (finishReason && finishReason !== FinishReason.STOP)
    throw new Error(`The next response chunk could not be completed due to the following reason: ${finishReason}`)

  return chunk.text()
}
