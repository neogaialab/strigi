import "./polyfills"
import process from "node:process"
import os from "node:os"
import { Builtins, Cli } from "clipanion"
import pkg from "../package.json"
import MainCommand from "./commands/MainCommand"
import { initConfig } from "./config"
import AuthCommand from "./commands/AuthCommand"
import LogoutCommand from "./commands/LogoutCommand"
import ExplainCommand from "./commands/ExplainCommand"
import RunCommand from "./commands/RunCommand"
import InstructCommand from "./commands/InstructCommand"

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
cli.register(RunCommand)
cli.register(AuthCommand)
cli.register(LogoutCommand)
cli.register(InstructCommand)
cli.register(MainCommand)
cli.runExit(process.argv.slice(2))
