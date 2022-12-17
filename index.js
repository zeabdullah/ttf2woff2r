const c = require('ansi-colors')
const fs = require('fs/promises')
const readdirp = require('readdirp')
const ttf2woff2 = require('ttf2woff2-no-gyp')
require('ansi-colors')

async function start(dir) {
  await convertToWoff2Recursively(dir)
}

async function convertFileToWoff2(file) {
  try {
    const pathWithoutExtension = file.fullPath.substring(
      0,
      file.fullPath.lastIndexOf('.ttf')
    )

    const newFilePath = pathWithoutExtension + '.woff2'
    const oldFileData = await fs.readFile(file.fullPath)

    await fs.writeFile(newFilePath, ttf2woff2(oldFileData))
    console.log(c.green(`✔ Converted to ${newFilePath}`))
  } catch (err) {
    console.log(
      c.red(`✖ conversion of ${file.basename} to woff2 failed: ${err.message}`)
    )
  }
}

async function convertToWoff2Recursively(dir) {
  for await (const entry of readdirp(dir)) {
    if (entry.path.endsWith('.ttf')) {
      await convertFileToWoff2(entry)
    }
  }
}

start(process.argv[2])
