#!/usr/bin/env node
const chalk = require('chalk');
const { version } = require('../package.json');
const {
  run,
  runDev,
  runProd,
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
console.log(chalk.green(`lyr ${version}`));
/** 解析配置文件 ./lry.config.ts */
const lyrConfig = run().default;
/** 创建 /src/.lyr */
createLyr(rootPath, lyrConfig.ignoreRouter);
/** 执行 webpack */
if (env === 'dev') {
  lyrConfig.mode = 'development';
  runDev(lyrConfig); // 构建
  createIndexHtml(rootPath, lyrConfig); // 创建 index.html
} else {
  lyrConfig.mode = 'production';
  runProd(lyrConfig); // 打包
  createIndexHtml(rootPath, lyrConfig); // 创建 index.html
}
