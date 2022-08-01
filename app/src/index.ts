import fs from 'fs/promises'

const repositoriesPaths = './repositories'
// const data = await fs.readFile(PATH, { encoding: 'utf8' })

const readFile = (path: string) => fs.readFile(path, { encoding: 'utf8' })
const getDirectories = (path: string): Promise<string[]> => fs.readdir(path)
const isDirectory = async (path: string) => (await fs.stat(path)).isDirectory()

const getAllFiles = async (folder: string): Promise<string[]> => {
	const paths = await getDirectories(folder)

	const files: string[] = []

	for (const subPath of paths) {
		const newPath = `${folder}/${subPath}`

		const _isDirectory = await isDirectory(newPath)

		if (_isDirectory) {
			files.push(...(await getAllFiles(newPath)))
		}

		files.push(newPath)
	}

	return files
}

const main = async () => {
	const repositories = await getDirectories(repositoriesPaths)

	const repo = `${repositoriesPaths}/${repositories[0]}/src`
	const files = await getAllFiles(repo)
	console.log(files)
}

main()
