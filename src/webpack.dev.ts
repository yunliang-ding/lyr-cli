import { merge } from 'webpack-merge';
import common from './common';
import { ConfigProps } from './type';
import * as webpack from 'webpack';
import * as WebpackDevServer from 'webpack-dev-server';
import * as chalk from 'chalk';

/** dev 本地开发 */
export default async (config: ConfigProps) => {
  const compiler = webpack(
    merge(
      common(config),
      config.webpackConfig?.(config.mode) || {}, // 合并 webpack
      {
        output: {
          filename: 'app.js',
        },
      } as any,
    ),
  );
  console.log(
    chalk.green('=> externals include '),
    chalk.gray(JSON.stringify(compiler.options.externals)),
  );
  const IP = (await WebpackDevServer.internalIP('v4')) || 'localhost'; // 获取ip地址
  const port = await WebpackDevServer.getFreePort(
    config.devServer?.port || 3000,
    IP,
  ); // 获取可用的 port
  const server = new WebpackDevServer(
    {
      ...config.devServer,
      compress: true,
      hot: false,
      allowedHosts: 'all',
      liveReload: true,
      port,
    },
    compiler,
  );
  server.startCallback((err) => {
    if (err) {
      console.log(err);
    }
  });
};
