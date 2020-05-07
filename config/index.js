/**
 * 服务器相关配置信息
 */
module.exports = {
  // 服务器配置
  server: {
    test: {
      host: '10.10.10.22',
      username: 'user',
      password: '123456',
    },
  },
  // 项目配置
  project: {
    'project-example': {
      localPath: './dist',
      serverPath: '/usr/local/tomcat/',
      extname: 'zip',
    },
  }
}