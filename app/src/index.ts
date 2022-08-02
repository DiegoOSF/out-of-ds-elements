import fs from 'fs/promises'
import { ignoreFolders, repositoriesPath, matchers } from './constants'

const writeFile = (filename: string, content: string) =>
	fs.writeFile(filename, content)
const readFile = (path: string) => fs.readFile(path, { encoding: 'utf8' })
const getDirectories = (path: string): Promise<string[]> => fs.readdir(path)
const isDirectory = async (path: string) => (await fs.stat(path)).isDirectory()

const getAllFiles = async (
	folder: string,
	ignoreFolder: string[],
): Promise<string[]> => {
	const paths = await getDirectories(folder)

	const files: string[] = []

	for (const subPath of paths) {
		const newPath = `${folder}/${subPath}`

		if (ignoreFolder.includes(subPath)) continue

		const _isDirectory = await isDirectory(newPath)

		if (_isDirectory) {
			files.push(...(await getAllFiles(newPath, ignoreFolder)))
			continue
		}

		files.push(newPath)
	}

	return files
}

const filterEachFile = async (paths: string[]) => {
	const hexadecimal = matchers['REGEX_HEXADECIMAL']

	paths.forEach(async path => {
		const file = await readFile(path)

		if (file.match(hexadecimal)) {
			// console.log(path)
			await writeFile(`repos-out-of-ds/${path}`, file)
		}
	})
}

const main = async () => {
	const repositories = await getDirectories(repositoriesPath)

	const repo = `${repositoriesPath}/${repositories[0]}/src`
	const files = await getAllFiles(repo, ignoreFolders)

	filterEachFile(files)

	// await writeFile('paths.txt', files.join('\n'))
}

main()
