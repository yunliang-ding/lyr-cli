#!/usr/bin/env node
const Application = require('thinkjs');
const watcher = require('think-watcher');
const chalk = require('chalk');
const { version } = require('../package.json');
const {
  run,
  runWatch,
  runBuild,
  createLyr,
  createIndexHtml,
} = require('../dist/index');
/** 解析配置文件 ./lry.config.ts */
const lyrConfig = run().default;
const type = process.argv.pop();
const rootPath = __dirname.split('/node_modules')[0];
if (type !== 'build') {
  console.log(chalk.green(`=> watch by thinkjs.`))
  // 在这里启动 thinkjs 服务
  const APP_PATH = `${rootPath}/${lyrConfig.serverPath || 'src/apis'}`;
  const instance = new Application({
    ROOT_PATH: rootPath,
    APP_PATH,
    env: 'development',
  });
  new watcher(
    {
      srcPath: APP_PATH,
    },
    (fileInfo) => {
      instance._watcherCallBack(fileInfo);
    },
  ).watch();
  instance.run(); // 启动 node 服务
}
/** 运行 */
if (type === 'dev') {
  console.log(chalk.green(`=> use lyr-cli ${version}`));
  lyrConfig.mode = 'development';
  lyrConfig.wsPort = lyrConfig.wsPort || 3003; // 默认 3003
  createLyr(rootPath, lyrConfig.ignoreRouter); // 创建 src/.lyr
  createIndexHtml(rootPath, lyrConfig); // 创建 index.html
  runWatch(lyrConfig); // 构建
} else if (type === 'build') {
  console.log(chalk.green(`=> use lyr-cli ${version}`));
  lyrConfig.mode = 'production';
  createLyr(rootPath, lyrConfig.ignoreRouter); // 创建 src/.lyr
  createIndexHtml(rootPath, lyrConfig); // 创建 index.html
  runBuild(lyrConfig); // 打包
}
