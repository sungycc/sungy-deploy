const os = require('os')
const { project } = require('../config')

// 获取项目名称
function getConfigPath() {
	const pwd = String.raw`${process.cwd()}`
	const dirs = pwd.split('\\')
	const pkn = dirs.find((item) => /^finance-.+/.test(item))
	console.log(pkn)
	console.log(dirs)
	if (pkn in project) {
		return project[pkn]
	}
	return null
}

module.exports = {
	getConfigPath,
}