#!/usr/bin/env node
const Application = require('thinkjs');
const watcher = require('think-watcher');
const chalk = require('chalk');
const { version } = require('../package.json');
const { getIPAddress, getAvailablePort } = require('./util');
const {
  runWatch,
  runBuild,
  runDeploy,
  getUserConfig,
} = require('../dist/index');
/** 解析配置文件 ./lry.config.ts */
const lyrConfig = getUserConfig().default;
const rootPath = process.cwd();
const APP_PATH = `${rootPath}/${lyrConfig.serverPath || 'src/apis'}`;
lyrConfig.version = version;
const type = process.argv.pop();
// 在这里启动 thinkjs 服务
if (type !== 'build' && type !== 'deploy') {
  console.log(chalk.green(`=> watch by thinkjs.`));
  think.beforeStartServer(async () => {
    await new Promise(res => setTimeout(res)); // 在异步之后才可以获取设置的端口
    const configPort = think.config("port");
    const port = await getAvailablePort(configPort);
    if (port !== configPort) {
      console.log(chalk.yellowBright(`${configPort} 端口已被占用，已启用 ${port} 端口`));
    }
    think.config("port", port);
  })
  const appServer = new Application({
    ROOT_PATH: rootPath,
    APP_PATH,
    env: 'development',
  });
  new watcher(
    {
      srcPath: APP_PATH,
    },
    (fileInfo) => {
      appServer._watcherCallBack(fileInfo);
    },
  ).watch();
  appServer.run(); // 启动 node 服务
}
/** 运行 */
(async () => {
  if (type === 'dev') {
    console.log(chalk.green(`=> use lyr-cli ${version}`));
    lyrConfig.mode = 'development';
    lyrConfig.wsPort = await getAvailablePort(4000); // 可用的 wsPort
    lyrConfig.wsHost = await getIPAddress() // 解析 host
    runWatch(rootPath, lyrConfig);
  } else if (type === 'build') {
    console.log(chalk.green(`=> use lyr-cli ${version}`));
    lyrConfig.mode = 'production';
    runBuild(rootPath, lyrConfig); // 打包
  } else if (type === 'deploy') {
    console.log(chalk.green(`=> use pm2 deploy.`));
    const { name } = require(`${rootPath}/package.json`);
    const pm2Path = `${__dirname}/pm2.json`;
    const scriptPath = `${__dirname}/script.js`;
    runDeploy({
      name,
      pm2Path,
      scriptPath,
      rootPath,
      APP_PATH,
    });
  }
})();
