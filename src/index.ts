import { transform } from '@babel/core';
import { ConfigProps } from './type';
import { resolve } from 'path';
import { readFileSync, outputFileSync, existsSync, writeFileSync } from 'fs-extra';
import { createIndexHtml, createLyr } from './create';
import chalk from 'chalk';
import runWatch from './webpack.watch';
import runBuild from './webpack.build';
import { getLyrConfig } from './template/code';

const { exec } = require('child_process');

const defineConfig = (props: ConfigProps) => {
  return props;
};

// 解析配置文件
const parseDefineConfig = () => {
  const configPath = resolve('./', './lyr.config.ts');
  if(!existsSync(configPath)){
    const { name } = require(resolve('./', './package.json'));
    writeFileSync(configPath, getLyrConfig({ packageName: name }))
  }
  let content = readFileSync(configPath);
  // 有时候读取不到?
  while (!content.toString()) {
    content = readFileSync(configPath);
  }
  const result = transform(content.toString(), {
    presets: ['env'],
  });
  if (result.code) {
    return eval(`(require, exports) => {
      ${result.code};
    }`);
  }
};

// 获取用户配置
const getUserConfig = (): any => {
  const _exports = {};
  const _require = (key: string) => {
    if (key === 'lyr') {
      return {
        defineConfig,
      };
    }
  };
  const fn = parseDefineConfig();
  fn(_require, _exports);
  return _exports;
};

// pm2 部署
const runDeploy = ({ name, pm2Path, scriptPath, rootPath, APP_PATH }) => {
  outputFileSync(
    pm2Path,
    `{
"apps": [
  {
    "name": "${name}",
    "cwd": "${rootPath}",
    "err_file": "${rootPath}/logs/err.log",
    "out_file": "${rootPath}/logs/out.log",
    "exec_mode": "fork",
    "script": "${scriptPath}",
    "max_memory_restart": "1G",
    "autorestart": true
  }
]
}`,
  );
  outputFileSync(
    scriptPath,
    `const Application = require('thinkjs');

new Application({
ROOT_PATH: "${rootPath}",
APP_PATH: "${APP_PATH}",
proxy: true, // use proxy
env: 'production'
}).run();
`,
  );
  exec(`pm2 startOrReload ${pm2Path}`, (err, stdout) => {
    if (err) {
      console.log(chalk.red(stdout));
    } else {
      console.log(chalk.gray(stdout));
      console.log(chalk.green('=> deploy success.'));
    }
  });
};

export {
  runBuild,
  runWatch,
  runDeploy,
  createLyr,
  getUserConfig,
  createIndexHtml,
};
