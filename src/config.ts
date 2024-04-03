import { join } from "node:path"
import os from "node:os"

export interface Config {
  geminiApiKey: string | null | undefined
}

export const DEFAULT_CONFIG: Config = {
  geminiApiKey: null,
}

const configDirPath = Bun.env.S_CONFIG_DIR_PATH || join(os.homedir(), "./.config/strigi")
const configPath = join(configDirPath, "config.json")
const file = Bun.file(configPath)

// eslint-disable-next-line import/no-mutable-exports
export let config = DEFAULT_CONFIG

export async function initConfig() {
  if (await file.exists())
    config = await file.json()
}

export async function saveConfig() {
  await Bun.write(configPath, JSON.stringify(config, null, 2))
}
