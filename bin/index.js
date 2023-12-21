#!/usr/bin/env node
const chalk = require('chalk');
const { run, runDev, runProd } = require('../dist/index');
const { version } = require('../package.json');
const tempCode = require('./template/code');
const { resolve } = require('path');
const fs = require("fs-extra");
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
/** 创建 /src/.lyr */
const rootPath = '../../../';
const output = resolve(__dirname, `${rootPath}/src/.lyr`);
fs.outputFile(`${output}/index.tsx`, tempCode.index);
fs.outputFile(`${output}/auth.tsx`, tempCode.auth);
fs.outputFile(`${output}/type.tsx`, tempCode.type);
fs.outputFile(`${output}/router.tsx`, tempCode.router);
console.log(chalk.green('=> create .lyr done.'));
/** 解析配置文件 ./lry.config.ts */
const userConfig = run();
console.log(chalk.green('=> parse lry.config.ts done.'));
/** 执行 webpack */
if (env === 'dev') {
  return runDev(userConfig.default);
}
runProd(userConfig.default); // 打包
