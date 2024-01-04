#!/usr/bin/env node
const Application = require('thinkjs');
const watcher = require('think-watcher');
const WebpackDevServer = require('webpack-dev-server');
const chalk = require('chalk');
const { version } = require('../package.json');
const {
  runWatch,
  runBuild,
  runDeploy,
  createLyr,
  createIndexHtml,
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
    lyrConfig.wsPort = await WebpackDevServer.getFreePort(); // 可用的 wsPort
    createLyr(rootPath, lyrConfig.ignoreRouter); // 创建 src/.lyr
    createIndexHtml(rootPath, lyrConfig); // 创建 index.html
    runWatch(lyrConfig);
  } else if (type === 'build') {
    console.log(chalk.green(`=> use lyr-cli ${version}`));
    lyrConfig.mode = 'production';
    createLyr(rootPath, lyrConfig.ignoreRouter); // 创建 src/.lyr
    createIndexHtml(rootPath, lyrConfig); // 创建 index.html
    runBuild(lyrConfig); // 打包
  } else if (type === 'deploy') {
    console.log(chalk.green(`=> use pm2.json deploy.`));
    const { name } = require(`${rootPath}/package.json`);
    const pm2Path = `${__dirname}/pm2.json`;
    const scriptPath = `${__dirname}/script.js`;
    runDeploy({
      name,
      pm2Path,
      scriptPath,
      rootPath,
      APP_PATH
    });
  }
})();
