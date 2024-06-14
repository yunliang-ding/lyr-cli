// @ts-ignore
import { resolve } from 'path';
import { merge } from 'webpack-merge';
import common from './common';
import { ConfigProps } from './type';
import webpack from 'webpack';
import chalk from 'chalk';
import { WebSocketServer } from 'ws';
import * as chokidar from 'chokidar';
import { getUserConfig, createLyr, createIndexHtml } from '.';

/** watch 持续监听 */
export default async (rootPath: string, config: ConfigProps) => {
  createLyr(rootPath, config); // 创建 src/.lyr
  createIndexHtml(rootPath, config); // 创建 index.html
  const compiler = webpack(
    merge(
      common(config),
      config.webpackConfig?.(config.mode) || {}, // 合并 webpack
      {
        output: {
          path: resolve('./', './www/dev'),
          filename: 'index.js',
        },
      } as any,
    ),
  );
  console.log(
    chalk.green('=> externals include '),
    chalk.gray(JSON.stringify(compiler.options.externals)),
  );
  // 创建ws
  const wss = new WebSocketServer({ host: config.wsHost, port: config.wsPort });
  let myWs;
  wss.on('connection', function connection(ws) {
    myWs = ws; // 赋值
  });
  /** 监听配置文件的改动 */
  const chokidarWatcher = chokidar.watch(`${rootPath}/lyr.config.ts`, {
    ignored: /node_modules/,
    ignoreInitial: true,
  });
  chokidarWatcher.on('change', () => {
    const config: any = getUserConfig().default;
    if (config) {
      console.log(chalk.magentaBright(`=> 配置文件改动，正在重新编译.`));
      config.mode = 'development';
      createLyr(rootPath, config); // 创建 src/.lyr
      createIndexHtml(rootPath, config); // 创建 index.html
      myWs?.send?.(1);
    }
  });
  compiler.watch(
    {
      ignored: /node_modules/,
    },
    (err, result: any) => {
      const { errors, assets } = result.compilation;
      if (errors?.length > 0) {
        console.log(chalk.bgRed(' error '), chalk.red(errors.toString()));
        myWs?.send?.(errors.toString());
      } else {
        myWs?.send?.(1);
        const size = assets['index.js'].size();
        console.log(
          chalk.green('构建完成'),
          chalk.gray(`index.js ${Number(size / 1024).toFixed(1)} kb`),
          chalk.bgMagenta(' Wait '),
          chalk.green('⌛️ Compiling...'),
        );
      }
    },
  );
};
