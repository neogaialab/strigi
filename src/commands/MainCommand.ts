import { Command, Option } from "clipanion";
import pkg from '../../package.json';
import generateCommand from "../services/generateCommand";

export default class MainCommand extends Command {
  query = Option.Rest({ name: "query", required: 1 })

  static usage = Command.Usage({
    description: pkg.description
  })

  async execute() {
    const query = this.query.join(" ");
    const generation = await generateCommand(query);

    this.context.stdout.write(`${generation.command}\n`);
  }
}
