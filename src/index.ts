import { transform } from '@babel/core';
import { ConfigProps } from './type';
import { resolve } from 'path';
import { readFileSync } from 'fs-extra';
import { createIndexHtml, createLyr } from './create';
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

// 获取用户配置
const getUserConfig = () => {
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

export { runBuild, runWatch, createLyr, getUserConfig, createIndexHtml };
