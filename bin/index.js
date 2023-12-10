#!/usr/bin/env node
const chalk = require('chalk');
const { run, runDev, runProd } = require('../dist/index');
const commond = {
  dev: 'dev',
  build: 'build',
};
const type = process.argv.pop();
const env = commond[type];
if (!env) {
  return console.log(chalk.redBright(`命令不存在: ${type}`));
}
const userConfig = run(); // 获取用户的配置文件 ./src/lry.config.ts
if (env === 'dev') {
  return runDev(userConfig);
}
runProd(userConfig); // 打包
