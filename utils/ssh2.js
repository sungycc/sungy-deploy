const ssh2 = require('ssh2')

function client(options) {
	const { password, username, port = 22, host } = options
	const conn = new ssh2.Client({ allowHalfOpen: true })
	return new Promise((resolve, rejected) => {
		conn.connect({
			username,
			password,
			port,
			host,
		})
		conn.on('ready', () => {
			resolve(conn)
		})
		conn.on('err', (err) => {
			rejected(err)
			conn.end()
			process.exit(1)
		})
	})
}

function clientExec(conn, cmd) {
	return new Promise((resolve, rejected) => {
		conn.exec(cmd, (err, stream) => {
			if (err) {
	  		console.log(err)
	  		process.exit(1)
	  		return
	  	}
	  	stream.on('finish', () => {
	  		conn.end()
	  		resolve()
	  	})
	  	.on('error', (err) => {
	  		console.log(err)
	  		conn.end()
	  		process.exit(1)
	  	})
		})
	})
}
module.exports = {
	client,
	clientExec,
}