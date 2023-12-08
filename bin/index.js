#!/usr/bin/env node

const fse = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const { runDev } = require("./webpack.dev");
const { runProd } = require("./webpack.prod");

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
const rootPath = path.resolve(__dirname, "../../../");

exports.rootPath = rootPath;

if (!fse.pathExists(`${rootPath}/lyr.json`)) {
  return console.log(chalk.redBright("缺少配置文件: lyr.json"));
}

// 获取配置文件
const config = require(`${rootPath}/lyr.json`);

// 运行
if (env === "dev") {
  return runDev(config);
}

// 打包
runProd(config);
