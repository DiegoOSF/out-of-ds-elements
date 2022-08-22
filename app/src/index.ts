import fs from 'fs/promises'
import * as fsync from 'fs'

import { ignoreFolders, matchers, repositories } from './constants'
import { FileType } from './interface'

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
			const file: FileType = {
				directory,
				filename: subPaths,
				path: newPath,
				content: '',
			}
			files.push(file)
		}
	}

	return files
}

const filterContent = (content: string, patterns: any[]) =>
	!!patterns.filter(pattern => content.match(pattern)).length

const main = async () => {
	const result: any = {}

	for (const repository of repositories) {
		const { path, projectName } = repository
		const files = await getAllFiles(path, ignoreFolders)

		result[projectName] = {}

		for (const file of files) {
			file.content = await readFile(file.path)

			const { filename, directory } = file

			const _file = { filename, directory }

			if (filterContent(file.content, [matchers.colorHexadecimal])) {
				const colors = result[projectName].colors || []
				result[projectName].colors = [...colors, _file]
			}

			if (filterContent(file.content, [matchers.buttonsReactNative])) {
				const buttons = result[projectName].buttons || []
				result[projectName].buttons = [...buttons, _file]
			}

			if (filterContent(file.content, [matchers.typography])) {
				const typography = result[projectName].typography || []
				result[projectName].typography = [...typography, _file]
			}
		}
	}

	createFile('results', 'data.json', JSON.stringify(result))
}

main()
