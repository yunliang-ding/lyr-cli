export const index = ({ version, noticeInfo, logo }) => `import { ReactElement, ReactNode, useEffect } from 'react';
import ReactDom from 'react-dom';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import Layout from '@/.theme/index';
import ErrorBoundary from '@/.theme/error-boundary';
import router from './router';
import AuthRouter from './auth';
import ConfigProps from './type';
import axios, { AxiosRequestConfig } from 'axios';
import breadcrumbStore from '@/store/breadcrumb';
import { PageHeaderProps } from '@arco-design/web-react';

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

const App = ({ routerInterceptors }) => {
  const element = createHashRouter([
    {
      path: '/',
      element: <Layout routerInterceptors={routerInterceptors} />,
      errorElement: <ErrorBoundary />,
      children: router
        .map((item) => ({
          ...AuthRouter(item),
          errorElement: <ErrorBoundary />,
        }))
        .concat([
          {
            path: '*',
            element: <h3>您访问的页面不存在!</h3>,
          },
        ] as any),
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
  routerInterceptors?: () => void | ReactNode;
}

export const runApp = async ({
  element = '#root',
  getInitData = async () => ({
    auth: [''],
    userInfo: {},
  }),
  loading = () => <span>加载中...</span>,
  axiosConfig = {},
  routerInterceptors
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
  ReactDom.render(<App routerInterceptors={routerInterceptors} />, document.querySelector(element));
};

export const defineConfig = (props: ConfigProps) => {
  return props;
};

interface BreadCrumbHeaderProps extends Omit<PageHeaderProps, "breadcrumb">{
  breadcrumb?: {
    icon?: ReactNode;
    path?: string;
    breadcrumbName?: string;
  }[]
}

export const useBreadCrumb = () => {
  useEffect(() => {
    return () => {
      Object.assign(breadcrumbStore, {
        title: '',
        breadcrumb: undefined,
        extra: [],
      });
    };
  }, []);
  return {
    update: (options: BreadCrumbHeaderProps) => {
      setTimeout(() => {
        Object.assign(breadcrumbStore, options);
      }, 10);
    },
  };
};

export const version = "${version}";

export const noticeInfo = "${noticeInfo}";

export const logo = "${logo}";
`;

export const auth = `import { initData } from './index';

export default ({ path, component }: { path: string; component: any }) => {
  const hasAuth =
    initData.auth.includes(component.type.auth) ||
    component.type.auth === undefined;
  return {
    path,
    element: hasAuth ? (
      component
    ) : <h3>您暂无权限访问该页面!</h3>,
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
  /** logo **/
  logo?: string;
  /** 描述信息 */
  noticeInfo?: string;
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
  /** webpack 配置 */
  webpackConfig?: (mode: 'development' | 'production') => Configuration;
  /** 服务端入口，默认 ./src/apis */
  serverPath?: string;
}

`;

export const getLyrConfig = ({ packageName }) => `import { defineConfig } from 'lyr';

export default defineConfig({
  title: '${packageName}',
  favicon: 'https://lyr-cli-oss.oss-cn-beijing.aliyuncs.com/assets/favicon.ico',
  link: [
    'https://lyr-cli-oss.oss-cn-beijing.aliyuncs.com/cdn/arco.min.css',
    'https://lyr-cli-oss.oss-cn-beijing.aliyuncs.com/cdn/lyr-component.min.css',
  ],
  devScript: [
    'https://lyr-cli-oss.oss-cn-beijing.aliyuncs.com/cdn/react.development.min.js',
    'https://lyr-cli-oss.oss-cn-beijing.aliyuncs.com/cdn/react-dom.development.min.js',
    'https://lyr-cli-oss.oss-cn-beijing.aliyuncs.com/cdn/router.development.js',
    'https://lyr-cli-oss.oss-cn-beijing.aliyuncs.com/cdn/react-router.development.js',
    'https://lyr-cli-oss.oss-cn-beijing.aliyuncs.com/cdn/react-router-dom.development.js',
    'https://lyr-cli-oss.oss-cn-beijing.aliyuncs.com/cdn/axios.min.js',
    'https://lyr-cli-oss.oss-cn-beijing.aliyuncs.com/cdn/jsx-runtime.polyfill.js',
    'https://lyr-cli-oss.oss-cn-beijing.aliyuncs.com/cdn/arco.min.js',
    'https://lyr-cli-oss.oss-cn-beijing.aliyuncs.com/cdn/arco-icon.min.js',
    'https://lyr-cli-oss.oss-cn-beijing.aliyuncs.com/cdn/aliyun-oss-sdk.min.js',
    'https://lyr-cli-oss.oss-cn-beijing.aliyuncs.com/cdn/lyr-component.min.js',
  ],
  buildScript: [
    'https://lyr-cli-oss.oss-cn-beijing.aliyuncs.com/cdn/react.development.min.js',
    'https://lyr-cli-oss.oss-cn-beijing.aliyuncs.com/cdn/react-dom.development.min.js',
    'https://lyr-cli-oss.oss-cn-beijing.aliyuncs.com/cdn/router.development.js',
    'https://lyr-cli-oss.oss-cn-beijing.aliyuncs.com/cdn/react-router.development.js',
    'https://lyr-cli-oss.oss-cn-beijing.aliyuncs.com/cdn/react-router-dom.development.js',
    'https://lyr-cli-oss.oss-cn-beijing.aliyuncs.com/cdn/axios.min.js',
    'https://lyr-cli-oss.oss-cn-beijing.aliyuncs.com/cdn/jsx-runtime.polyfill.js',
    'https://lyr-cli-oss.oss-cn-beijing.aliyuncs.com/cdn/arco.min.js',
    'https://lyr-cli-oss.oss-cn-beijing.aliyuncs.com/cdn/arco-icon.min.js',
    'https://lyr-cli-oss.oss-cn-beijing.aliyuncs.com/cdn/aliyun-oss-sdk.min.js',
    'https://lyr-cli-oss.oss-cn-beijing.aliyuncs.com/cdn/lyr-component.min.js',
  ],
});
`
export const getIndexHtml = ({
  favicon,
  title,
  script,
  link,
  liveReload,
}) => `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="${favicon}" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  ${liveReload}
  ${link}
</head>

<body>
  <div id="root" />
</body>
${script}
</html>`;
