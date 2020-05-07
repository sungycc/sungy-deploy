# @sungy/deploy

[node.js](http://nodejs.org) 命令行工具，解决的问题：前端项目没有接入CI/CD，每次发版需要手动打包后解压->手动连接ssh->手动xftp上传代码等步骤，这种部署发方式比较繁琐并且时间成本高，此工具可以一行代码实现自动构建并部署web项目。

## 安装

```bash
npm install @sungy/deploy -g
```

将根目录下的pscp.exe文件粘贴至C:\Windows\System32目录下，也可以自己安装pscp

## 使用

```bash
sungy-deploy
```

## 注意事项

- 如果服务器(IP/用户/密码)有所变化，请及时更新./config/index.js中的server配置
- 如果有新增项目或者项目部署目录发生变化，请及时更新./config/index.js中的project配置
