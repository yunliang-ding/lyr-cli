/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable prefer-template */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackBar = require('webpackbar');
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer")
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = (rootPath) => ({
  performance: false, // 去掉性能上的警告
  externals: {
    axios: 'axios',
    react: 'React',
    'react-dom': 'ReactDOM',
    // 'react-router-dom': 'ReactRouterDOM',
    'react-core-form': 'ReactCoreForm',
    '@arco-design/web-react': 'arco',
    '@arco-design/web-react/icon': 'arcoicon',
    'react-color': 'ReactColor',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve(rootPath, './src'),
      'lyr': path.resolve(rootPath, './src/.lyr'),
    },
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          // loader: 'ts-loader',
          loader: 'esbuild-loader', // 构建时间缩短一半
          options: {
            // target: 'es2015'
          }
        },
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
      {
        test: /\.(svg|png|jpe?g|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'image',
            limit: 1024 * 10, // 图片大于阈值 不会转base64,小于会转base64
          },
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          },
        },
      },
    ],
  },
  plugins: [
    // new BundleAnalyzerPlugin({
    // }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new WebpackBar({
      basic: false, // 默认true，启用一个简单的日志报告器
      profile: false, // 默认false，启用探查器。
    }),
    new CompressionPlugin(), // 开发资源开启gzip
  ],
})
