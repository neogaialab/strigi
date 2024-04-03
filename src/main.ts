import { GoogleGenerativeAI } from "@google/generative-ai";
import { Builtins, Cli } from 'clipanion';
import pkg from '../package.json';
import MainCommand from "./commands/MainCommand";

const genAI = new GoogleGenerativeAI(Bun.env.GEMINI_API_KEY);
export const gemini = genAI.getGenerativeModel({ model: "gemini-pro" });

const [node, app, ...args] = process.argv;

const cli = new Cli({
  binaryName: "s",
  binaryLabel: "Strigi",
  binaryVersion: pkg.version,
});
cli.register(Builtins.HelpCommand);
cli.register(Builtins.VersionCommand);
cli.register(MainCommand)
cli.runExit(args);
