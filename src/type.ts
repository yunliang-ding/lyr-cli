import { Configuration } from 'webpack';
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
  /** 文件路由配置 */
  fileRouter?: {
    use?: boolean; // 是否启用
    ignore?: string[];
  };
  /** 是否开启资源包分析 */
  bundleAnalyzer?: BundleAnalyzerPlugin.Options;
  /** oss 配置 */
  ossConfig?: {
    bucket: string;
    region: string;
    accessKeyId: string;
    accessKeySecret: string;
  };
  /** webpack 配置 */
  webpackConfig?: (mode: 'development' | 'production') => Configuration;
  mode?: 'development' | 'production'
}
