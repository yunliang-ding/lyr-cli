#!/usr/bin/env node
const Application = require('thinkjs');
const watcher = require('think-watcher');
const WebpackDevServer = require('webpack-dev-server')
const chalk = require('chalk');
const { version } = require('../package.json');
const {
  runWatch,
  runBuild,
  createLyr,
  createIndexHtml,
  getUserConfig,
} = require('../dist/index');
/** 解析配置文件 ./lry.config.ts */
const rootPath = process.cwd();
const lyrConfig = getUserConfig().default;
lyrConfig.version = version;
const type = process.argv.pop();
if (type !== 'build') {
  console.log(chalk.green(`=> watch by thinkjs.`))
  // 在这里启动 thinkjs 服务
  const APP_PATH = `${rootPath}/${lyrConfig.serverPath || 'src/apis'}`;
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
(async() => {
  if (type === 'dev') {
    console.log(chalk.green(`=> use lyr-cli ${version}`));
    lyrConfig.mode = 'development';
    lyrConfig.wsPort = await WebpackDevServer.getFreePort(); // 可用的 wsPort
    createLyr(rootPath, lyrConfig.ignoreRouter); // 创建 src/.lyr
    createIndexHtml(rootPath, lyrConfig); // 创建 index.html
    runWatch(lyrConfig)
  } else if (type === 'build') {
    console.log(chalk.green(`=> use lyr-cli ${version}`));
    lyrConfig.mode = 'production';
    createLyr(rootPath, lyrConfig.ignoreRouter); // 创建 src/.lyr
    createIndexHtml(rootPath, lyrConfig); // 创建 index.html
    runBuild(lyrConfig); // 打包
  }
})()

