import { defineConfig } from "vitepress"

export default defineConfig({
  title: "Strigi",
  description: "CLI command assistance utilizing GenAI-powered natural language prompts.",
  lang: "en-US",
  base: "/strigi/",
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Docs", link: "/about/introduction" },
      {
        text: "About",
        items: [
          { text: "Introduction", link: "/about/introduction" },
          { text: "Changelog", link: "https://github.com/neogaialab/strigi/blob/main/CHANGELOG.md" },
          { text: "Roadmap", link: "https://github.com/neogaialab/strigi/blob/main/CONTRIBUTING.md#project-management" },
          { text: "Contributing Guide", link: "https://github.com/neogaialab/strigi/blob/main/CONTRIBUTING.md" },
        ],
      },
    ],
    sidebar: [
      {
        text: "About",
        items: [
          { text: "Introduction", link: "/about/introduction" },
          { text: "Roadmap", link: "/about/roadmap" },
          { text: "Open Source", link: "/about/open-source" },
        ],
      },
      {
        text: "Guide",
        items: [
          { text: "Installation", link: "/guide/installation" },
          { text: "Authentication", link: "/guide/authentication" },
          { text: "Getting Assistance", link: "/guide/getting-assistance" },
          { text: "Configuration", link: "/guide/configuration" },
        ],
      },
      {
        text: "Reference",
        items: [
          { text: "CLI Reference", link: "/reference/cli" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/neogaialab/strigi" },
    ],

    footer: {
      message: "",
      copyright: `2024-${new Date().getFullYear()} Luis Emidio`,
    },
  },
})
