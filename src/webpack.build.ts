import { resolve } from 'path';
import { merge } from 'webpack-merge';
import common from './common';
import { ConfigProps } from './type';
import * as webpack from 'webpack';
import * as chalk from 'chalk';

/** build 打包 */
export default (config: ConfigProps) => {
  const compiler = webpack(
    merge(
      common(config),
      config.webpackConfig?.(config.mode) || {}, // 合并 webpack
      {
        output: {
          path: resolve('./', config.fullStack ? './www/build' : './build'),
          filename: 'app.js',
        },
      } as any,
    ),
  );
  console.log(
    chalk.green('=> externals include '),
    chalk.gray(JSON.stringify(compiler.options.externals)),
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
      console.log(err, chalk.red(String(stats?.compilation.errors)));
      // 以非零状态码结束进程
      process.exit(1);
    }
  });
};
