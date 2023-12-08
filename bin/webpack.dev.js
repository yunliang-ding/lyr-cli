const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const FileRouterPlugin = require("./plugin/file-router-plugin.js");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const webpack = require("webpack");
const chalk = require("chalk");

const rootPath = path.resolve(__dirname, "../../../");

exports.runDev = (userConfig) => {
  const compiler = webpack(
    merge(
      common,
      {
        mode: "development",
        output: {
          path: path.resolve(rootPath, "../app/www/dev"),
          filename: "app.js",
        },
        stats: "errors-only",
        plugins: [
          // new webpack.HotModuleReplacementPlugin(),
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
    () => {
      console.log(
        chalk.green("构建完成"),
        chalk.bgMagenta(" WAIT "),
        chalk.green("Compiling...")
      );
    }
  );
};
