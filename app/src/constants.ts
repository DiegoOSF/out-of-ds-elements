export const ignoreFolders = [
	'assets',
	'__mocks__',
	'__tests__',
	'__test__',
	'__snapshots__',
	'interfaces.ts',
	'interface.ts',
	'index.spec.ts',
	'index.spec.tsx',
]

export const repositoriesPath = './repositories'

export const matchers = {
	REGEX_HEXADECIMAL: RegExp(/#((\w{2})(\w{2})(\w{2})|(\w{3}))/gm),
}
