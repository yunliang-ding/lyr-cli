export interface ConfigProps {
  /** 文件路由配置 */
  router?: {
    ignore?: string[];
  };
  /** 是否开启资源包分析 */
  bundleAnalyzer?: {
    host?: string
  },
  /** cdn */
  cdn?: (mode: 'dev' | 'build') => string[];
  /** oss 配置 */
  ossConfig?: {
    bucket: string;
    region: string;
    accessKeyId: string;
    accessKeySecret: string;
  };
  /** webpack 配置 */
  webpackConfig?: (mode: 'dev' | 'build') => {
    /** 剔除的包 */
    externals?: {
      [key: string]: string;
    };
  };
}
