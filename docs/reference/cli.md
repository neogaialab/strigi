# CLI {#cli}

## `(main)` <Badge type="info" text="command" />

Get CLI command assistance based on a prompt.

- Usage

  ```bash
  $ s <prompt> ...
  ```

- Options
  - **-e, --explain**: (optional) Get an explanation for a command directly.
  - **-r, --revise**: (optional) Revise a command directly.
  - **-v, --version**: (optional) Get the Strigi version.
  - **-h, --help**: (optional) Get help.

- Details

  The `main` command is a versatile shortcut that combines the functionality of `s generate`, `s explain` with the `-e` flag, and `s revise` with the `-r` flag. It allows you to execute a shell command directly, obtain an explanation or revise a specific command in natural language.

- Examples

  Generate a command to list only JSON files:

  ```bash
  $ s "how to list JSON files"
  ```

  Get an explanation for the `git status` command:

  ```bash
  $ s explain "git status"
  ```

## `auth` <Badge type="info" text="subcommand" />

Set Gemini API key and authenticate.

- Usage

  ```bash
  $ s auth
  ```

- Options
  - **-g, --gemini #0**: (optional) Gemini API key to use

- Details

  The `auth` command facilitates authentication by saving the obtained Gemini API key in the configuration file.

## `logout` <Badge type="info" text="subcommand" />

Log out and remove Gemini API key.

- Usage

  ```bash
  $ s logout
  ```

- Details

  The `logout` command securely removes the Gemini API key from the configuration, enhancing access control and security measures.

## `generate` <Badge type="info" text="subcommand" />

Generate and execute commands from natural language prompts.

- Usage

  ```bash
  $ s generate <prompt> ...
  ```

  ```bash
  $ s g <prompt> ...
  ```

- Details

  The `s generate` command is designed to interpret natural language prompts and generate corresponding CLI commands. It then offers the option to revise the generated command before execution.

- Examples

  Generate and execute a command to list files:

  ```bash
  $ s generate "list files in current directory"
  ```

  Get an explanation for the `git status` command:

  ```bash
  $ s generate "update all packages"
  ```

## `explain` <Badge type="info" text="subcommand" />

Get an explanation for a command.

- Usage

  ```bash
  $ s explain <command>
  ```

  ```bash
  $ s e <command>
  ```

- Details

  The `s explain` command is designed to provide comprehensive explanations for specific CLI commands, aiding users in understanding their usage and functionalities in-depth.

- Examples

  Get an explanation for the `ls` command:

  ```bash
  $ s explain "ls"
  ```

  Get an explanation for the `git status` command:

  ```bash
  $ s explain "git status"
  ```

## `revise` <Badge type="info" text="subcommand" />

Start a command revision.

- Usage

  ```bash
  $ s revise <command>
  ```

  ```bash
  $ s r <command>
  ```

- Details

  The `s revise` command is designed to start directly a revision for a command. This enables you to tailor the command to your specific needs before execution.

- Examples

  Start a revision for the `ls` command:

  ```bash
  $ s revise "ls"
  ```

  Start a revision for the `git log` command:

  ```bash
  $ s revise "git log"
  ```

## `instruct` <Badge type="info" text="subcommand" />

Add custom instructions for tailored responses.

- Usage

  ```bash
  $ s instruct
  ```

  ```bash
  $ s i
  ```

- Details

  The `s instruct` command empowers you to provide specific guidelines or preferences to the model for more tailored and accurate responses. Your custom instructions will be integrated into future interactions with the model.
