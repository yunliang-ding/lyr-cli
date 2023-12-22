// @ts-ignore
import { resolve } from 'path';
import { merge } from 'webpack-merge';
import common from './webpack.common';
import * as webpack from 'webpack';
import * as WebpackDevServer from 'webpack-dev-server';
import * as chalk from 'chalk';
import * as FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import { ConfigProps } from './type';

/** dev 本地开发 */
export const runDev = async (config: ConfigProps) => {
  const compiler = webpack(
    merge(
      common(config),
      config.webpackConfig?.(config.mode) || {}, // 合并 webpack
      {
        output: {
          filename: 'app.js',
        },
        stats: 'errors-only',
        plugins: [new FriendlyErrorsWebpackPlugin()],
      } as any,
    ),
  );
  console.log(
    chalk.green('=> externals'),
    chalk.gray(JSON.stringify(compiler.options.externals, null, 2)),
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
      liveReload: true,
      port,
    },
    compiler,
  );
  server.listen(port, IP, (err) => {
    if (err) {
      console.log(err);
    }
    console.log(chalk.green(`=> server is running at http://${IP}:${port}`));
  });
};

/** watch 持续监听 */
export const runWatch = (config: ConfigProps) => {
  const compiler = webpack(
    merge(
      common(config),
      config.webpackConfig?.(config.mode) || {}, // 合并 webpack
      {
        output: {
          path: resolve('./', './app/www/dev'),
          filename: 'app.js',
        },
        stats: 'errors-only',
        plugins: [new FriendlyErrorsWebpackPlugin()],
      } as any,
    ),
  );
  console.log(
    chalk.green('=> externals'),
    chalk.gray(JSON.stringify(compiler.options.externals, null, 2)),
  );
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
    },
  );
};

/** build 打包 */
export const runProd = (config: ConfigProps) => {
  const compiler = webpack(
    merge(
      common(config),
      config.webpackConfig?.(config.mode) || {}, // 合并 webpack
      {
        output: {
          path: resolve('./', './app/www/build'),
          filename: 'app.js',
        },
      } as any,
    ),
  );
  console.log(
    chalk.green('=> externals'),
    chalk.gray(JSON.stringify(compiler.options.externals, null, 2)),
  );
  compiler.run((err, stats: any) => {
    if (!err && !stats?.hasErrors()) {
      // 构建成功，手动结束进程
      console.log(chalk.green('👏 👏 👏 打包完成...'));
      Object.keys(stats.compilation.assets).forEach((key) => {
        if (key === 'app.js' || key === 'app.css') {
          console.log(
            chalk.gray(
              `${key}: ${Number(
                stats.compilation.assets[key].size() / 1024,
              ).toFixed(1)} kb`,
            ),
          );
        }
      });
      process.exit(0); // 退出
    } else {
      // 构建失败，输出错误信息
      console.log(chalk.red(String(stats?.compilation.errors)));
      // 以非零状态码结束进程
      process.exit(1);
    }
  });
};
