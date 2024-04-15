# Installation

## Package Manager

The easiest way to install Strigi is using a package manager for your system. Here are the commands for popular package managers:

::: code-group

```sh [pnpm]
  $ pnpm add -g strigi
```

```sh [npm]
  $ npm install -g strigi
```

```sh [yarn]
  $ yarn global add strigi
```

```sh [bun]
  $ bun install -g strigi
```

:::

## Manual Installation <Badge type="danger" text="advanced" />

:::info Requirements

- [Git](https://git-scm.com/downloads)
- [Bun](https://bun.sh/)

:::

For advanced users who prefer manual installation, follow these steps:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/neogaialab/strigi
   ```

2. **Change Directory and Install Dependencies:**

   ```bash
   cd strigi
   bun install
   ```

3. **Build the Standalone Binary:**

   ```bash
   bun run build
   ```

   This will create a standalone executable file for Strigi within the `dist/` directory.

4. **(Optional) Move the Binary to Your PATH:**

   The generated binary might not be accessible from anywhere in your terminal by default. To make it accessible system-wide, you'll need to move it to a directory included in your PATH environment variable. Consult your system's documentation for specific instructions on managing PATH variables.
