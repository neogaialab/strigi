import { GoogleGenerativeAI } from "@google/generative-ai";
import { Builtins, Cli, Command, Option } from 'clipanion';
import figlet from 'figlet';
import pkg from '../package.json';

const genAI = new GoogleGenerativeAI(Bun.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function genText() {
  const prompt = "What is a cyberbrain?"

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
}

class MainCommand extends Command {
  noArt = Option.Boolean("--no-art", { description: "Skip ASCII art" });

  static usage = Command.Usage({
    description: pkg.description
  })

  async execute() {
    if (!this.noArt) {
      const body = figlet.textSync("Strigi");
      this.context.stdout.write(`${body}\n`);
    }

    const text = await genText();
    this.context.stdout.write(`${text}\n`);
  }
}

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
