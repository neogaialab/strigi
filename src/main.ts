import process from "node:process"
import { Builtins, Cli } from "clipanion"
import pkg from "../package.json"
import AuthCommand from "./commands/AuthCommand"
import ExplainCommand from "./commands/ExplainCommand"
import GenerateCommand from "./commands/GenerateCommand"
import InstructCommand from "./commands/InstructCommand"
import LogoutCommand from "./commands/LogoutCommand"
import MainCommand from "./commands/MainCommand"
import ReviseCommand from "./commands/ReviseCommand"
import { initConfig } from "./config"
import "./polyfills"

await initConfig()

process.on("SIGINT", () => {
  process.stdout.write("\n\n")
  process.exit()
})

const cli = new Cli({
  binaryName: "s",
  binaryLabel: "Strigi",
  binaryVersion: pkg.version,
})
cli.register(Builtins.HelpCommand)
cli.register(Builtins.VersionCommand)
cli.register(ExplainCommand)
cli.register(ReviseCommand)
cli.register(GenerateCommand)
cli.register(AuthCommand)
cli.register(LogoutCommand)
cli.register(InstructCommand)
cli.register(MainCommand)
cli.runExit(process.argv.slice(2))
