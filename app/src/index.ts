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

type FieldType = {
	field: string
	matcher: typeof RegExp
}

async function main(fields: FieldType[]) {
	const result: any = {}

	for (const repository of repositories) {
		const { path, projectName } = repository
		const files = await getAllFiles(path, ignoreFolders)

		result[projectName] = {}

		for (const file of files) {
			file.content = await readFile(file.path)

			const { filename, directory } = file

			fields.forEach(({ field, matcher }) => {
				if (filterContent(file.content, [matcher])) {
					const list = result[projectName][field] || []
					result[projectName][field] = [...list, { filename, directory }]
				}
			})
		}
	}

	return result
}

const facade = async () => {
	const fields = [
		{ field: 'colors', matcher: matchers.colorHexadecimal },
		{ field: 'buttons', matcher: matchers.buttonsReactNative },
		{ field: 'typography', matcher: matchers.typography },
	] as unknown

	const result = await main(fields as FieldType[])

	createFile('results', 'data.json', JSON.stringify(result))
}

facade()
