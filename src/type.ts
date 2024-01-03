import { Configuration } from 'webpack';
import { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

export interface ConfigProps {
  /** 标题 */
  title?: string;
  /** icon */
  favicon?: string;
  /** 开发环境 script */
  devScript?: string[];
  /** 生产环境 script */
  buildScript?: string[];
  /** css */
  link?: string[];
  /** 忽略路由配置 */
  ignoreRouter?: string[];
  /** 是否开启资源包分析 */
  bundleAnalyzer?: BundleAnalyzerPlugin.Options;
  /** dev-server 配置 */
  devServer?: DevServerConfiguration;
  /** webpack 配置 */
  webpackConfig?: (
    mode: 'development' | 'production' | undefined,
  ) => Configuration;
  /** 服务端入口，默认 ./src/apis */
  serverPath?: string;
  mode?: 'development' | 'production';
  wsPort?: number;
  version?: string;
}
