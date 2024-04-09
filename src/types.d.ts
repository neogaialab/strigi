export interface Config {
  geminiApiKey: string | null | undefined
  customInstructions?: CustomInstructions
}

export interface CustomInstructions {
  aboutMe: string
  responsePreference: string
}
