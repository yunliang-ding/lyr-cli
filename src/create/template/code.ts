export const index = `import { ReactElement } from 'react';
import ReactDom from 'react-dom';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import Layout from '@/layouts/index';
import ErrorBoundary from '@/pages/error-boundary';
import router from './router';
import AuthRouter from './auth';
import ConfigProps from './type';
import axios, { AxiosRequestConfig } from 'axios';
import '@/global.less';

const store = {
  request: axios.create({}),
  initData: {
    auth: [''],
    userInfo: {},
  },
};

export const request = store.request;

export const initData = store.initData;

const App = () => {
  const element = createHashRouter([
    {
      path: '/',
      element: <Layout />,
      errorElement: <ErrorBoundary />,
      children: router.map((item) => ({
        ...AuthRouter(item),
        errorElement: <ErrorBoundary />,
      })),
    },
  ]);
  return <RouterProvider router={element} />;
};

interface AppProps {
  element?: string;
  loading?: () => ReactElement;
  getInitData?: () => Promise<{
    auth: string[];
    userInfo: any;
  }>;
  axiosConfig?: AxiosRequestConfig & {
    requestInterceptors?: any;
    responseInterceptors?: any;
  };
}

export const runApp = async ({
  element = '#root',
  getInitData = async () => ({
    auth: [''],
    userInfo: {}
  }),
  loading = () => <span>加载中...</span>,
  axiosConfig = {},
}: AppProps) => {
  /** 创建 axios 实例 */
  const axiosinstance = axios.create(axiosConfig);
  if (typeof axiosConfig.requestInterceptors === 'function') {
    axiosinstance.interceptors.request.use(axiosConfig.requestInterceptors);
  }
  if (typeof axiosConfig.responseInterceptors === 'function') {
    axiosinstance.interceptors.response.use(axiosConfig.responseInterceptors);
  }
  Object.assign(store.request, axiosinstance); // 覆盖下
  ReactDom.render(loading(), document.querySelector(element));
  Object.assign(store.initData, await getInitData()); // 覆盖下
  ReactDom.render(<App />, document.querySelector(element));
};

export const defineConfig = (props: ConfigProps) => {
  return props;
};

`;

export const auth = `import NoMatch from '@/pages/404';
import NoAuthority from '@/pages/403';
import { initData } from './index';

export default ({ path, component }: { path: string; component: any }) => {
  if (path === '/404') {
    return {
      path: '*',
      element: <NoMatch />,
    };
  }
  const hasAuth =
    initData.auth.includes(component.type.auth) ||
    component.type.auth === undefined;
  return {
    path,
    element: hasAuth ? component : <NoAuthority />,
  };
};
`;

export const type = `import { Configuration } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

export default interface ConfigProps {
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
  /** oss 配置 */
  ossConfig?: {
    bucket: string;
    region: string;
    accessKeyId: string;
    accessKeySecret: string;
  };
  /** webpack 配置 */
  webpackConfig?: (mode: 'development' | 'production') => Configuration;
}

`;

export const indexHtml = ({ favicon, title, script, link }) => `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="${favicon}" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
${link}
</head>

<body>
  <div id="root" />
</body>
${script}
</html>`;