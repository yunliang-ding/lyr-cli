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
  watch: 'watch',
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
lyrConfig.mode = 'development'; // 默认开发环境
/** 创建 /src/.lyr */
createLyr(rootPath, lyrConfig.ignoreRouter);
/** 执行 webpack */
if (env === 'dev') {
  createIndexHtml(rootPath, lyrConfig); // 创建 index.html
  runDev(lyrConfig); // 构建
} else if (env === 'watch') {
  createIndexHtml(rootPath, lyrConfig); // 创建 index.html
  runWatch(lyrConfig); // 构建
} else {
  createIndexHtml(rootPath, lyrConfig); // 创建 index.html
  lyrConfig.mode = 'production';
  runProd(lyrConfig); // 打包
}
