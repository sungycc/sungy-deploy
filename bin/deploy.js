#!/usr/bin/env node

const program = require('commander')
const path = require('path')
const ora = require('ora')
const { version } = require('../package.json')
const { server, project } = require('../config')
const { getConfigPath } = require('../utils/index')
const exec = require('../utils/exec')
const { client, clientExec } = require('../utils/ssh2')

program
  .version(version, '-v, --version')
  .option('-e --environment <environment>', '测试环境参数, 如：-e 1')
  .option('-r --reupload', '传送失败，重传压缩文件，跳过构建')
  .option('-f --file <filename>', '压缩包名字')
  .option('-o --output <dir>', '输出目录')
  .parse(process.argv)

const env = `test${program.environment}`
const isReload = program.reupload

if (!(env in server)) {
  console.warn('暂时只支持1-6的测试环境，如：-e 1')
  process.exit(0)
}

const pwd = process.cwd()
const pkn = require(path.resolve(pwd, 'package.json')).name
const { password, username, host } = server[env]
const projectPath = getConfigPath()

if (program.output) { projectPath.localPath = program.output }

const zipName = program.file || projectPath.zipName || `${pkn}-${env}.zip`
const zipPath = path.resolve(pwd, projectPath.localPath, zipName)


/**
 * 运行函数
 */
async function run() {
	
	const startTime = Date.now()

	const spinner = new ora()

	if (!isReload) {
    // 调用项目本身的构建包
    spinner.start(`正在调用项目构建： yarn ${env} ...\n`)
    await exec(`yarn.cmd ${env}`, { cwd: pwd })
    spinner.succeed(`项目构建完成 \n`)
  }

  spinner.start(`开始传输压缩包到${env}...\n`)
  const cmd = `pscp -pw ${password} ${zipPath} ${username}@${host}:${projectPath.serverPath}`
  await exec(cmd, {}, (evt, cmd, data) => {
  	if (evt === 'stderr' && data.toString().includes('Store key in cache? (y/n)')) {
  		cmd.stdin.write('y\n')
      return
  	}
    if (evt === 'stderr' && data.length) {
      console.log(data.toString())
      process.exit(1)
    }
  })
  // console.log(res)
  spinner.succeed(`压缩包传输完成 \n`)

  // 开始连接test服务器
  spinner.start(`开始连接${env}服务器...\n`)
  const conn = await client(server[env])
  spinner.succeed(`连接${env}服务器成功...\n`)

  spinner.start(`开始解压${pkn}-${env}.zip...\n`)
  await clientExec(conn, `unzip -o ${projectPath.serverPath}${zipName} -d ${projectPath.serverPath}`)
  spinner.succeed(`解压完成...\n`)

  console.log('运行耗时： ', (Date.now() - startTime)/1000, 's')
  console.log('发布时间： ', (new Date()).toLocaleString())
}

run()
// console.log(process.stdin)