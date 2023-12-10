// @ts-ignore
import path from 'path';
import { merge } from 'webpack-merge';
import common from './config';
import webpack from 'webpack';
import chalk from 'chalk';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';

const rootPath = path.resolve(__dirname, '../../../');

/** 编译 */
export const runDev = (userConfig) => {
  const compiler = webpack(
    merge(
      common(rootPath),
      {
        mode: 'development',
        output: {
          path: path.resolve(rootPath, './app/www/dev'),
          filename: 'app.js',
        },
        stats: 'errors-only',
        plugins: [new FriendlyErrorsWebpackPlugin()],
      },
      userConfig,
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
      common(rootPath),
      {
        mode: 'production',
        output: {
          path: path.resolve(rootPath, './app/www/build'),
          filename: 'app.js',
        },
      },
      userConfig,
    ),
  );
  compiler.run((err, result) => {
    console.log(chalk.green('👏 打包完成...'));
    console.log(chalk.gray(String(result)));
  });
};

