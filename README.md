<div align="center">
  <!-- <img src="https://github.com/neogaialab.png" width="128" height="128"/> -->
  <h1>Strigi — CLI Command Assistant</h1>
  </table>
</div>

![Demo](/public/demo.gif)

|                                                                                   |                                                                               |
| --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **🔍 Describe:** Generate commands effortlessly using natural language queries. | **🌐 Open-source:** Strigi is open-source, allowing for transparency and community contributions. |
| **✏️ Revise:** Easily review and revise generated commands for accuracy and customization. | **💰 Free:** Enjoy free usage of Strigi by bringing your own Gemini API key. |
| **📚 Understand:** Ask for detailed explanations before executing commands for better understanding. | **🎨 Elegant:** Experience elegant and visually appealing terminal output styling. |
| **▶️ Run:** Run commands directly without the need to manually copy and paste. | **⚡ Fast:** Utilize streaming for fast and efficient responses, enhancing performance. |

---

## Guide

### Installation

To install Strigi, use npm:

```bash
npm install -g strigi
```

Or with other package managers like PNPM, Yarn, or Bun!

### Authentication

1. Obtain a Gemini API key from Google AI Studio. [Get an API key](https://makersuite.google.com/app/apikey)
2. After you have a key copied, use `s auth`.

If you need to delete the API key from the config, you can use `s logout`.

### Generating Commands

Generate commands by running:

```bash
s <query> ...
```

For example:

```bash
s how to list files
```

### Getting Help

Get help using:

```bash
s -h
```

Additionally, you can get more details about any command by using the `-h` or `--help` flag after the command name:

```bash
s <command> -h
```

## Contributing

We value and appreciate your contributions, no matter how big or small. Please refer to our [Contributing Guidelines](CONTRIBUTING.md) for detailed instructions on how to contribute to the project. Your input helps us improve and grow!

## Special Thanks

Strigi extends a special thanks to the following technologies and libraries that power its functionality:

- **Bun:** A fast JavaScript all-in-one toolkit.
- **Google Generative AI** and **Gemini:** Google's cutting-edge SDK for advanced artificial intelligence development capabilities.
- **Clipanion:** Type-safe CLI library with no runtime dependencies.
- **Inquirer:** A collection of common interactive command line user interfaces.
- **Chalk** and **Chalk-template:** Terminal string styling with tagged template literals.
- **Ora:** An elegant terminal spinner.
- **TypeScript:** A strongly typed programming language that builds on JavaScript.

These technologies play a pivotal role in powering Strigi and enriching its capabilities.
