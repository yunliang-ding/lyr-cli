const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

const rootPath = path.resolve(__dirname, "../../../");

module.exports = merge(
  common,
  {
    mode: "production",
    output: {
      path: path.resolve(rootPath, "../app/www/dev"),
      filename: "app.js",
    },
  },
  {}
);
