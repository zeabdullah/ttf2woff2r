const Enquirer = require('enquirer')
const fs = require('fs/promises')
const readdirp = require('readdirp')
const ttf2woff2 = require('ttf2woff2-no-gyp')

async function start(args) {
  if (args.length < 1) {
  }
  args.forEach(arg => {
    if (isADir(arg)) {
      convertToWoff2Recursively(arg)
    } else if (isAFile(arg)) {
      convertFileToWoff2(arg)
    }
  })
}

async function convertFileToWoff2(file) {
  try {
    const pathWithoutExtension = file.fullPath.substring(
      0,
      file.fullPath.lastIndexOf('.ttf')
    )

    const newFilePath = pathWithoutExtension + '.woff2'
    const oldFileData = await fs.readFile(file.fullPath)

    return fs.writeFile(newFilePath, ttf2woff2(oldFileData))
  } catch (err) {
    console.log(
      '😢 conversion of',
      file.basename,
      'to woff2 failed:',
      err.message
    )
  }
}

async function convertToWoff2Recursively(dir) {
  for await (const entry of readdirp(dir)) {
    if (entry.path.endsWith('.ttf')) {
      await convertFileToWoff2(entry)
    }
  }
  console.log(`🎉 conversion successful for files in '${dir}'`)
}

start(process.argv.slice(2))
console.log(process.argv.slice(1))
console.log(process.argv.slice(2))
