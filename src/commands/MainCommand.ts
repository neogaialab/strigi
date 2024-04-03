import { confirm, select } from '@inquirer/prompts';
import chalk from "chalk";
import c from "chalk-template";
import { Command, Option } from "clipanion";
import ora from 'ora';
import pkg from '../../package.json';
import { getGemini } from '../gemini';
import { explainCommandStream } from "../services/explainCommand";
import generateCommand from "../services/generateCommand";

type Actions = 'run' | 'cancel' | 'explain'

export default class MainCommand extends Command {
  static usage = Command.Usage({
    description: pkg.description
  })

  query = Option.Rest({ name: "query", required: 1 })

  explanation: string | null = null

  async respond(query: string, cmd: string, options?: { refreshCmd: boolean }) {
    if (options?.refreshCmd) {
      this.context.stdout.write(chalk.blue(`${cmd}\n\n`));
    }

    const action = await select<Actions>({
      message: "",
      choices: [
        {
          name: 'Run',
          value: 'run'
        },
        {
          name: 'Cancel',
          value: 'cancel',
        },
        {
          name: !this.explanation ? 'Explain' : 'Explain again',
          value: 'explain',
        }
      ]
    })

    const cancel = () => {
      this.context.stdout.write(c`{yellow Canceled.}\n`)
    }

    const run = async () => {
      const answer = await confirm({
        message: 'Are you sure you want to run?',
        default: true,
      })

      if (answer) {
        this.context.stdout.write(c`\n{green Executing...}\n`)

        const cmdArray = cmd.split(" ");
        const label = cmdArray[0];

        const commandPath = Bun.which(label);

        if (!commandPath) {
          this.context.stdout.write(c`{red Command not found in PATH}\n`)
          return;
        }

        const res = Bun.spawnSync(cmdArray);

        if (!res.success) {
          this.context.stdout.write(c`{red Command failed with exit code ${res.exitCode}. }\n\n${res.stderr}`)
          return;
        }

        this.context.stdout.write(`\n${res.stdout}`)
        return;
      }

      cancel()
    }

    const explain = async () => {
      const spinner = ora().start();

      const explanationStream = await explainCommandStream(query, cmd);
      let explanation = '';

      spinner.stop()

      this.context.stdout.write(`\n`)

      for await (const chunk of explanationStream) {
        const chunkText = chunk.text();
        this.context.stdout.write(chunkText)
        explanation += chunkText;
      }

      this.context.stdout.write(`\n\n`)
      this.explanation = explanation;

      await this.respond(query, cmd, { refreshCmd: true });
    }

    const actions: Record<typeof action, () => Promise<void> | void> = {
      run,
      cancel,
      explain,
    }
    const handle = actions[action]!;

    await handle()
  }

  async execute() {
    try {
      getGemini()
    } catch (e) {
      this.context.stdout.write(c`{red Gemini API key not set.}\n`)
      return;
    }

    const spinner = ora().start();

    const query = this.query.join(" ");
    const cmdStream = await generateCommand(query)
    spinner.stop();

    let cmd = '';

    this.context.stdout.write(`\n`)

    for await (const chunk of cmdStream) {
      const chunkText = chunk.text();
      this.context.stdout.write(chunkText)
      cmd += chunkText;
    }

    this.context.stdout.write(`\n\n`)

    this.respond(query, cmd)
  }
}
