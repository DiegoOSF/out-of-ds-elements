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
	// '/(.spec.tsx{0,1})/gm'
]

export const repositoriesPath = './repositories'

export const matchers = {
	colorHexadecimal: RegExp(/#((\w{2})(\w{2})(\w{2})|(\w{3}))/gm),
	buttonsReactNative: RegExp(
		/(TouchableOpacity)|(TouchableWithoutFeedback)|(<button>)|(styled.button)|(<button)/gm,
	),
	typography: RegExp(/(font-family)|(typography)|(styled.h)|(styled.p)/gm),
	'creditas-lab': RegExp(/(creditas-lab)/gm),
}

export const repositories = [
	{
		projectName: 'blog-mf-dashboard',
		path: 'D:/code/osf/creditas/dashboard-mf/blog-mf-dashboard/src',
	},

	{
		projectName: 'discovery-mf-dashboard',
		path: 'D:/code/osf/creditas/dashboard-mf/discovery-mf-dashboard/src',
	},

	{
		projectName: 'header-mf-dashboard/',
		path: 'D:/code/osf/creditas/dashboard-mf/header-mf-dashboard/src',
	},

	{
		projectName: 'spotlight-mf-dashboard',
		path: 'D:/code/osf/creditas/dashboard-mf/spotlight-mf-dashboard/src',
	},

	{
		projectName: 'simulator-mf-dashboard',
		path: 'D:/code/osf/creditas/dashboard-mf/simulator-mf-dashboard/src',
	},
]
