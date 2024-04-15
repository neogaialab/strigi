import { defineConfig } from "vitepress"

export default defineConfig({
  title: "Strigi",
  description: "CLI command assistance utilizing GenAI-powered natural language prompts.",
  lang: "en-US",
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Docs", link: "/overview/introduction" },
      {
        text: "About",
        items: [
          { text: "Introduction", link: "/overview/introduction" },
          { text: "Changelog", link: "https://github.com/neogaialab/strigi/blob/main/CHANGELOG.md" },
          { text: "Contributing Guide", link: "https://github.com/neogaialab/strigi/blob/main/CONTRIBUTING.md" },
        ],
      },
    ],
    sidebar: [
      {
        text: "Overview",
        items: [
          { text: "Introduction", link: "/overview/introduction" },
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
