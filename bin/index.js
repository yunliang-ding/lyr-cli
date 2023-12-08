#!/usr/bin/env node

const fse = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const { runDev } = require('./webpack.dev')
const { runProd } = require('./webpack.prod')

const rootPath = '/home/lighthouse/local/react-core-form-admin'

const commond = {
  dev: "dev",
  build: "build",
};

const type = process.argv.pop();

const env = commond[type];

if (!env) {
  return console.log(chalk.redBright(`命令不存在: ${type}`));
}

/** 开始运行 */
const configPath = path.resolve(
  __dirname,
  "../../react-core-form-admin/lyr.json"
);

if (!fse.pathExists(configPath)) {
  return console.log(chalk.redBright("缺少配置文件: lyr.json"));
}

// 获取配置文件
const config = require(configPath);

// 运行
if(env === 'dev'){
  return runDev({
    ...config,
    entry: path.resolve(
      __dirname,
      "../../react-core-form-admin/src/app.tsx"
    ),
  });
}

runProd(config);