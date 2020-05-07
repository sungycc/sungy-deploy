const { spawn } = require('child_process')

/**
 * Promise版的spawn
 * @param cmd 命令
 * @param options 配置项
 * @param cb 回调函数
 */
const spawnPromise = (cmd, options = {}, cb) => {
	const [command, ...params] = cmd.split(' ')
  return new Promise((resolve, rejected) => {
    const shell = spawn(command, params, options)
    // 运行中
    shell.stdout.on('data', (data) => {
    	// console.log(data.toString())
    	if (cb) cb('stdout', shell,  data)
    })
    // err
    shell.stderr.on('data', (data) => {
    	// console.log(data.toString())
    	if (cb) cb('stderr', shell, data)
    	// console.log(data.toString())
    })
    // close
    shell.on('close', (code) => {
    	if (cb) cb('close', shell, code)
    	resolve()
    })
    shell.on('error', (err) => {
    	rejected(err)
    	console.log(err)
    	process.exit(1)
    })
  })
}

module.exports = spawnPromise