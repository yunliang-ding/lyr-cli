// @ts-ignore
import { resolve } from 'path';
import { merge } from 'webpack-merge';
import common from './common';
import { ConfigProps } from './type';
import * as WebpackDevServer from 'webpack-dev-server';
import * as webpack from 'webpack';
import * as chalk from 'chalk';
import { WebSocketServer } from 'ws';

/** watch 持续监听 */
export default async (config: ConfigProps) => {
  const compiler = webpack(
    merge(
      common(config),
      config.webpackConfig?.(config.mode) || {}, // 合并 webpack
      {
        output: {
          path: resolve('./', './www/dev'),
          filename: 'app.js',
        },
      } as any,
    ),
  );
  console.log(
    chalk.green('=> externals include '),
    chalk.gray(JSON.stringify(compiler.options.externals)),
  );
  // 创建ws
  const host = await WebpackDevServer.internalIP('v4')
  const wss = new WebSocketServer({ host, port: config.wsPort });
  let myWs;
  wss.on('connection', function connection(ws) {
    myWs = ws; // 赋值
  });
  compiler.watch(
    {
      ignored: /node_modules/,
    },
    (err, result: any) => {
      let fileInfo = '';
      Object.keys(result.compilation.assets).forEach(function (key) {
        if (key === 'app.js') {
          fileInfo = `${key}: ${Number(
            result.compilation.assets[key].size() / 1024,
          ).toFixed(1)} kb`;
        }
      });
      console.log(
        chalk.green('构建完成'),
        chalk.gray(fileInfo),
        chalk.bgMagenta(' Wait '),
        chalk.green('⌛️ Compiling...'),
      );
      myWs?.send?.('构建完成');
    },
  );
};
