import { Command, Option } from "clipanion";
import pkg from '../../package.json';
import generateCommand from "../services/generateCommand";
import { select, confirm } from '@inquirer/prompts';
import c from "chalk-template";

export default class MainCommand extends Command {
  query = Option.Rest({ name: "query", required: 1 })

  static usage = Command.Usage({
    description: pkg.description
  })

  async execute() {
    const query = this.query.join(" ");
    const generation = await generateCommand(query);

    this.context.stdout.write(`${generation.command}\n`);

    const action = await select<'run' | 'cancel'>({
      message: "",
      choices: [
        {
          name: 'Run',
          value: 'run'
        },
        {
          name: 'Cancel',
          value: 'cancel',
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

        const cmd = generation.command.split(" ");
        const label = cmd[0];

        const commandPath = Bun.which(label);

        if (!commandPath) {
          this.context.stdout.write(c`{red Command not found in PATH}\n`)
          return;
        }

        const res = Bun.spawnSync(cmd);

        if (!res.success) {
          this.context.stdout.write(c`{red Command failed with exit code ${res.exitCode}. }\n\n${res.stderr}`)
          return;
        }

        this.context.stdout.write(`\n${res.stdout}`)
        return;
      }

      cancel()
    }

    const actions: Record<typeof action, () => Promise<void> | void> = {
      run,
      cancel,
    }
    const handle = actions[action]!;

    await handle()
  }
}
