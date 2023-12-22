import { transform } from '@babel/core';
import { ConfigProps } from './type';
import { resolve } from 'path';
import { readFileSync } from 'fs-extra';
import { createIndexHtml, createLyr } from './create';
import runDev from './webpack.dev';
import runWatch from './webpack.watch';
import runBuild from './webpack.build';

const defineConfig = (props: ConfigProps) => {
  return props;
};

// 解析配置文件
const parseDefineConfig = () => {
  const configPath = resolve('./', './lyr.config.ts');
  const content = readFileSync(configPath);
  const result = transform(content.toString(), {
    presets: ['env'],
  });
  if (result.code) {
    return eval(`(require, exports) => {
      ${result.code};
    }`);
  }
};

// 运行，类似反编译，最终的目的是获取用户在 defineConfig函数中 定义的参数
const run = () => {
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

export { run, runDev, runBuild, createLyr, runWatch, createIndexHtml };
