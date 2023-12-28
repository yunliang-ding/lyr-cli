#!/usr/bin/env node
const chalk = require('chalk');
const { version } = require('../package.json');
const {
  run,
  runWatch,
  runBuild,
  createLyr,
  createIndexHtml,
} = require('../dist/index');
const commond = {
  dev: 'dev',
  build: 'build',
};
const type = process.argv.pop();
const env = commond[type];
if (!env) {
  return console.log(chalk.redBright(`命令不存在: ${type}`));
}
const rootPath = __dirname.split('/node_modules')[0];
console.log(chalk.green(`=> lyr ${version}`));
/** 解析配置文件 ./lry.config.ts */
const lyrConfig = run().default;
/** 运行 */
if (env === 'dev') {
  lyrConfig.mode = 'development';
  lyrConfig.wsPort = lyrConfig.wsPort || 3003; // 默认 3003
  createLyr(rootPath, lyrConfig.ignoreRouter); // 创建 src/.lyr
  createIndexHtml(rootPath, lyrConfig); // 创建 index.html
  runWatch(lyrConfig); // 构建
} else if (env === 'build') {
  lyrConfig.mode = 'production';
  createLyr(rootPath, lyrConfig.ignoreRouter); // 创建 src/.lyr
  createIndexHtml(rootPath, lyrConfig); // 创建 index.html
  runBuild(lyrConfig); // 打包
}
