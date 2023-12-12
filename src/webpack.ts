// @ts-ignore
import { resolve } from 'path';
import { merge } from 'webpack-merge';
import common from './webpack.common';
import * as webpack from 'webpack';
import * as chalk from 'chalk';
import * as FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';

/** 编译 */
export const runDev = (userConfig) => {
  const compiler = webpack(
    merge(
      {
        mode: 'development',
        output: {
          path: resolve('./', './app/www/dev'),
          filename: 'app.js',
        },
        stats: 'errors-only',
        plugins: [new FriendlyErrorsWebpackPlugin()],
      },
      common(userConfig) as any,
    ),
  );
  compiler.watch(
    {
      ignored: /node_modules/,
    },
    (err, result) => {
      console.log(
        chalk.green('构建完成'),
        chalk.gray(String(result).split('\n')[0]),
        chalk.bgMagenta(' Wait '),
        chalk.green('⌛️ Compiling...'),
      );
    },
  );
};

/** 打包 */
export const runProd = (userConfig) => {
  const compiler = webpack(
    merge(
      {
        mode: 'production',
        output: {
          path: resolve('./', './app/www/build'),
          filename: 'app.js',
        },
      },
      common(userConfig) as any,
    ),
  );
  compiler.run((err, result) => {
    console.log(chalk.green('👏 打包完成...'));
    console.log(chalk.gray(String(result)));
  });
};
