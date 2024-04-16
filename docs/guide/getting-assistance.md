# Getting Assistance

This guide covers the core functionalities of using Strigi.

## Generating Commands in Natural Language

Strigi excels at understanding natural language. Here's how to leverage this to generate commands:

1. **Open your terminal:** This is where you'll interact with Strigi.
2. **Type your request:** Describe the action you want to perform in natural language. For example, you could type:

   ```bash
   $ s "list all files in the current directory"
   ```

3. **Press Enter:** Strigi will analyze your request and generate a corresponding command.
4. **Choose your action**: Once you have the generated command, you're in control! Here are your options:

  - **Run**: Execute your command by selecting this option, pressing `Enter`, confirming again, and  witnessing the results in your terminal.
  - **Revise**: Ensure precision by reviewing and modifying the generated command. Select this option, press `Enter`, and enter your revise prompt.
  - **Explain**: Gain insights into a command's purpose and usage. Select this option, press `Enter`, and delve deeper into its functionality.
  - **Cancel**: Opt out of the current action by selecting this option and pressing `Enter`. Alternatively, terminate the interaction pressing `Ctrl+C`.

## Getting Explanations for Existing Commands

Understanding existing commands is another area where Strigi can be helpful:

1. **Type your request:**  Use natural language to ask for an explanation of a specific command. For example:

   ```bash
   $ s explain "git status"
   ```

   Or, you can alternatively use:

   ```bash
   $ s -e "git status"
   ```

2. **Press Enter:** Strigi will analyze your request and provide a clear explanation of the command's purpose, usage, and options.

## Asking for Revision

Strigi allows you to easily review and modify commands for accuracy and customization. Follow these steps to request a revision:

1. **Open your terminal:** Ensure you're in the terminal where you interact with Strigi.
2. **Type your request:** For example, to revise the command `git log`, type:

   ```bash
   $ s revise "git log"
   ```

3. **Press Enter:** Strigi will process your request and prompt you to enter the desired adjustments.
4. **Modify as needed:** Describe your adjustments in natural language for accuracy and precision.
5. **Choose your action:** Once you have the revised command, proceed with your desired action as usual.
