// @ts-ignore
import { resolve } from 'path';
import { merge } from 'webpack-merge';
import common from './webpack.common';
import * as webpack from 'webpack';
import * as chalk from 'chalk';
import * as FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';

/** 编译 */
export const runDev = (userConfig) => {
  const mode = 'development';
  userConfig.mode = mode;
  const compiler = webpack(
    merge(
      {
        mode,
        output: {
          path: resolve('./', './app/www/dev'),
          filename: 'app.js',
        },
        stats: 'errors-only',
        plugins: [new FriendlyErrorsWebpackPlugin()],
      },
      common(userConfig),
      userConfig.webpackConfig?.(mode) || {}, // 合并 webpack
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

/** 打包 */
export const runProd = (userConfig) => {
  const mode = 'production';
  userConfig.mode = mode;
  const compiler = webpack(
    merge(
      {
        mode,
        output: {
          path: resolve('./', './app/www/build'),
          filename: 'app.js',
        },
      },
      common({
        ...userConfig,
        mode: 'production',
      }),
      userConfig.webpackConfig?.(mode) || {}, // 合并 webpack
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
