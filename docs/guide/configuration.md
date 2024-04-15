# Configuration

Strigi is designed to work out of the box without requiring configuration. However, for curated Strigi's behavior, there are a few configuration options available.

## Providing General Contextual Instructions

Strigi strives to be adaptable, and you can leverage the `s instruct` command to provide specific instructions or preferences that influence its responses.

* Use the following command to begin the process:

  ```bash
  $ s instruct
  ```

* Strigi will prompt you with two questions:

  * `What would you like the model to know about you to provide better responses?` - This allows you to share details about your environment or preferences (e.g., "I primarily use a Linux environment").  This information can help Strigi tailor its responses and command suggestions to your specific context.
  * `How would you like the model to respond?` - Here, you can specify your preferred response style (e.g., brief, detailed, specific tone).

## Setting Your Preferred Explanation Language

* To initiate the customization process, use the command:

  ```bash
  $ s instruct
  ```

* In the first prompt (about yourself), you can leave the default behavior and press `Enter`.
* In the second prompt (regarding model responses), add a statement indicating your preferred locale. For example:

  ```
  Respond using pt-br.
  ```

## Tailoring Command Generation to Your Operating System

* To instruct Strigi to prioritize commands specific to your operating system (e.g., Linux distribution), type the following command.

  ```bash
  $ s instruct
  ```

* In the first prompt (about yourself), add a statement indicating your operating system. For example:

  ```
  I use Arch btw.
  ```

* In the second prompt (regarding model responses), you can leave the default behavior.
