#!/usr/bin/env node

const webpack = require("webpack");
const path = require("path");

const commond = {
  dev: 'dev',
  build: 'build',
};

const type = process.argv.pop();

const env = commond[type];

if (!env) {
  return console.log(chalk.redBright(`命令不存在: ${type}`));
}

const rootPath = path.resolve(__dirname, '../../../');

console.log(path.resolve(rootPath, './src/lyr.config.ts'));
// 运行
webpack({
  entry: path.resolve(rootPath, './src/lyr.config.ts'),
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'esbuild-loader'
        },
      },
    ]
  }
}).run(() => {
  console.log('开启二次编译')
})
