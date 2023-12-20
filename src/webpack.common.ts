import { resolve } from 'path';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as WebpackBar from 'webpackbar';
import * as BundleAnalyzer from 'webpack-bundle-analyzer';
import FileRouterPlugin from './file-router-plugin';
import HtmlTemplatePlugin from './html-template-plugin';
import * as CompressionPlugin from 'compression-webpack-plugin';
import { ConfigProps } from './type';

const _WebpackBar: any = WebpackBar;

export default (config: ConfigProps) => ({
  entry: './src/app.tsx',
  performance: false, // 去掉性能上的警告
  externals: {
    axios: 'axios',
    react: 'React',
    'react-dom': 'ReactDOM',
    'react-router-dom': 'ReactRouterDOM',
    'react-core-form': 'ReactCoreForm',
    '@arco-design/web-react': 'arco',
    '@arco-design/web-react/icon': 'arcoicon',
    'react-color': 'ReactColor',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': resolve('./', './src'),
      lyr: resolve('./', './src/.lyr'),
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
          },
        },
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
      {
        test: /\.css$/,
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
    config.bundleAnalyzer && config.mode === 'development'
      ? new BundleAnalyzer.BundleAnalyzerPlugin(config.bundleAnalyzer)
      : undefined,
    new MiniCssExtractPlugin({
      filename: 'app.css',
    }),
    new _WebpackBar({
      basic: false, // 默认true，启用一个简单的日志报告器
      profile: false, // 默认false，启用探查器。
    }),
    // 资源开启gzip
    new CompressionPlugin(),
    // 文件路由
    new FileRouterPlugin({
      ignorePaths: config.fileRouter?.ignore || [
        'schema-',
        'component/',
        'components/',
      ],
    }),
    // 插入 cdn
    new HtmlTemplatePlugin(config),
  ],
});
