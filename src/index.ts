import fse from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { runDev, runProd } from './core';
import { ConfigProps } from './type';

const commond = {
  dev: 'dev',
  build: 'build',
};

const type: any = process.argv.pop();

const env = commond[type];

const rootPath = path.resolve(__dirname, '../../../');

export const defineConfig = (props: ConfigProps) => {
  console.log(props);
  if (!env) {
    return console.log(chalk.redBright(`命令不存在: ${type}`));
  }
  if (!fse.pathExists(`${rootPath}/lyr.json`)) {
    console.log(chalk.redBright('缺少配置文件: lyr.json'));
    return;
  }
  // 获取配置文件
  const config = require(`${rootPath}/lyr.json`);
  // 运行
  if (env === 'dev') {
    return runDev(config);
  }
  // 打包
  runProd(config);
};
