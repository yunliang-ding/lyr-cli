#!/usr/bin/env node
const chalk = require('chalk');
const { run, runDev, runProd } = require('../dist/index');
const { version } = require('../package.json');
const { createLyr, createIndexHtml } = require('./create');
const commond = {
  dev: 'dev',
  build: 'build',
};
const type = process.argv.pop();
const env = commond[type];
if (!env) {
  return console.log(chalk.redBright(`命令不存在: ${type}`));
}
console.log(chalk.green(`lyr ${version}`));
/** 解析配置文件 ./lry.config.ts */
const lyrConfig = run().default;
/** 创建 /src/.lyr */
createLyr(lyrConfig.ignoreRouter);
/** 执行 webpack */
if (env === 'dev') {
  lyrConfig.mode = 'development';
  runDev(lyrConfig); // 构建
  createIndexHtml(lyrConfig); // 创建 index.html
} else {
  lyrConfig.mode = 'production';
  runProd(userConfig.default); // 打包
  createIndexHtml(lyrConfig); // 创建 index.html
}
