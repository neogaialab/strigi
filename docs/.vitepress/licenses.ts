import { execSync } from "node:child_process"
import fs from "node:fs/promises"

const DEST = "./docs/about/open-source.md"

function getFixedRepositoryUrl(packageName) {
  // Remove the git+ prefix and .git suffix
  packageName = packageName.replace(/^git\+|\.git$/g, "")

  // Remove git://
  packageName = packageName.replace(/^git:\/\//, "https://")

  return packageName
}

async function getPackagesInfo(dependencies, type) {
  let content = `\n## ${type} Dependencies:\n\n`

  for (const [packageName, version] of Object.entries(dependencies)) {
    try {
      // Fetch package information using npm
      const packageInfo = JSON.parse(
        execSync(`npm view ${packageName} --json`).toString(),
      )

      // Get license information
      const license = packageInfo.license || "No license specified"
      let repositoryUrl = packageInfo.repository
        ? packageInfo.repository.url
        : `https://www.npmjs.com/package/${packageName}`
      repositoryUrl = getFixedRepositoryUrl(repositoryUrl)

      // Accumulate package details
      content += `- ${packageName} (${version})\n`
      content += `  - License: ${license}\n`
      content += `  - Repository: ${repositoryUrl}\n\n`

      // eslint-disable-next-line no-console
      console.log(`Fetched info for ${packageName}`)
    }
    catch (error) {
      console.error(`Error fetching info for ${packageName}: ${error.message}`)
    }
  }

  return content
}

async function main() {
  try {
    // Read package.json
    const packageJson = JSON.parse(await fs.readFile("./package.json", "utf-8"))

    // Initialize the content for the markdown file
    let markdownContent = "# Open Source\n\n"
    markdownContent += "This page not only lists all the dependencies used in Strigi, both for development and production purposes, but also serves as a special thanks to the technologies and tools that power the project's functionality. These dependencies are integral to the development and success of Strigi, and we extend our sincere gratitude to the creators and maintainers of these libraries and tools for their hard work and innovation.\n"

    // Process dependencies and devDependencies
    if (packageJson.dependencies)
      markdownContent += await getPackagesInfo(packageJson.dependencies, "Production")

    if (packageJson.devDependencies)
      markdownContent += await getPackagesInfo(packageJson.devDependencies, "Development")

    // Write the content to the file
    await fs.writeFile(DEST, markdownContent)

    // eslint-disable-next-line no-console
    console.log(`Open source information written to ${DEST}`)
  }
  catch (error) {
    console.error("Error reading package.json or writing to file:", error.message)
  }
}

main()
