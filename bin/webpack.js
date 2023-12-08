const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const FileRouterPlugin = require("./plugin/file-router-plugin.js");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const webpack = require("webpack");
const chalk = require("chalk");

const rootPath = path.resolve(__dirname, "../../../");

/** 编译 */
exports.runDev = (userConfig) => {
  const compiler = webpack(
    merge(
      common(rootPath),
      {
        mode: "development",
        output: {
          path: path.resolve(rootPath, "./app/www/dev"),
          filename: "app.js",
        },
        stats: "errors-only",
        plugins: [
          new FriendlyErrorsWebpackPlugin(),
          new FileRouterPlugin({
            ignorePaths: ["schema-", "component/", "components/"],
          }),
        ],
      },
      userConfig
    )
  );
  compiler.watch(
    {
      ignored: /node_modules/,
    },
    (err, result) => {
      console.log(
        chalk.green("构建完成"),
        chalk.gray(String(result).split('\n')[0]),
        chalk.bgMagenta(" Wait "),
        chalk.green("⌛️ Compiling...")
      );
    }
  );
};

/** 打包 */
exports.runProd = (userConfig) => {
  const compiler = webpack(
    merge(
      common(rootPath),
      {
        mode: "production",
        output: {
          path: path.resolve(rootPath, "./app/www/build"),
          filename: "app.js",
        },
      },
      userConfig
    )
  );
  compiler.run((err, result) => {
    console.log(chalk.green("👏 打包完成..."));
    console.log(chalk.gray(String(result)))
  });
};
