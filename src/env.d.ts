declare module "bun" {
  interface Env {
    S_GEMINI_API_KEY: string | undefined;
    S_CONFIG_DIR_PATH: string;
  }
}
