import fs from 'fs/promises'
import * as fsync from 'fs'

import { ignoreFolders, repositoriesPath, matchers } from './constants'

const writeFile = (filename: string, content: string) =>
	fs.writeFile(filename, content)

const readFile = (path: string) => fs.readFile(path, { encoding: 'utf8' })

const getDirectories = (path: string): Promise<string[]> => fs.readdir(path)

const isDirectory = async (path: string) => (await fs.stat(path)).isDirectory()

const existPath = (path: string) => fsync.existsSync(path)

const createDirectory = (path: string) =>
	fsync.mkdirSync(path, { recursive: true })

const createFile = (directory: string, filename: string, content: string) => {
	const path = `${directory}/${filename}`
	if (!existPath(directory)) createDirectory(directory)

	writeFile(path, content)
}

interface FileType {
	filename: string
	directory: string
	path: string
}

const getAllFiles = async (
	directory: string,
	ignoreFolder: string[],
): Promise<FileType[]> => {
	const paths = await getDirectories(directory)

	const files: FileType[] = []

	for (const subPaths of paths) {
		const newPath = `${directory}/${subPaths}`

		if (ignoreFolder.includes(subPaths)) continue

		const _isDirectory = await isDirectory(newPath)

		if (_isDirectory) {
			const fileList = await getAllFiles(newPath, ignoreFolder)
			files.push(...fileList)
		} else {
			const file = { directory, filename: subPaths, path: newPath }
			files.push(file)
		}
	}

	return files
}

const filterEachFile = async (files: FileType[]) => {
	const hardcodedColor = matchers['REGEX_HEXADECIMAL']

	for (const { filename, directory, path } of files) {
		const outDirectory = `out-of-ds/${directory.replace('./', '')}`

		const file = await readFile(path)

		if (file.match(hardcodedColor)) createFile(outDirectory, filename, file)
	}
}

const main = async () => {
	const repositories = await getDirectories(repositoriesPath)

	const repo = `${repositoriesPath}/${repositories[0]}/src`
	const files = await getAllFiles(repo, ignoreFolders)

	filterEachFile(files)
}

main()
