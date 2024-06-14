## 设计初衷

- 实现一个更加适合团队开发习惯的一款轻量、高效、可定制化 `React` 全栈开发框架

## 快速开始

- 在终端执行以下命令

```shell
yarn create lyr-cli new my-app
```

- 选择 `lyr-react-web` 模版

![demo](http://lyr-cli-oss.oss-cn-beijing.aliyuncs.com/assets/base1.png)

- 按照 README.md 启动服务如下、支持暗黑主题和主题切换

![demo](http://lyr-cli-oss.oss-cn-beijing.aliyuncs.com/assets/mode3.png)

![demo](http://lyr-cli-oss.oss-cn-beijing.aliyuncs.com/assets/mode4.png)

## 约定规范

### 页面路由

- 默认约定规则如下，当文件名变化，触发自动更新

```jsx
src/layouts // 页面壳子

src/pages/**/*.tsx // 路由文件

src/pages/**/$id.tsx // 动态路由

src/pages/403.tsx // 暂无权限

src/pages/404.tsx // 不存在

src/pages/error-boundary.tsx // 错误边界
```

### 接口路由

- src/apis/controller 约定参看 [基于 thinkjs3.x](https://thinkjs.org/zh-cn/doc/3.0/controller.html) 的路由规则

### 路由鉴权

- 假设存在 /src/pages/admin.tsx

```jsx
const Page = () => {
  return <div>仅管理员权限可见</div>;
};

Page.auth = '/admin/list'; // 配置了 auth 则表示需要做鉴权，具体 auth 在下面的 getInitData 方法中返回

export default Page;
```

### 设置面包屑

- 假设存在 /src/pages/user.tsx

```jsx
import { useEffect } from 'react';
import { useBreadCrumb } from 'lyr';

export default () => {
  const breadCrumb = useBreadCrumb();
  useEffect(() => {
    breadCrumb.update({
      title: '自定义标题',
      breadcrumb: [
        {
          path: '/custom',
          breadcrumbName: '一级标题',
        },
        {
          path: '/custom/xxx',
          breadcrumbName: '二级标题',
        },
      ],
      extra: <Button type="primary">自定义</Button>,
    });
  }, []);
  return <div>面包屑配置</div>;
};
```

## 全局样式

- 默认引入 src/global.less

## 入口文件

- 入口文件 src/app.tsx

```jsx
import { runApp } from 'lyr';

runApp({
  /** 节点 */
  element: '#root',
  /** loading */
  loading: () => <Loading />,
  /** 加载勾子 */
  getInitData: async () => {
    return {
      auth: [], // 用户鉴权
      userInfo: {}, // 用户信息
    };
  },
  /** 请求配置 */
  axiosConfig: {
    timeout: 1000 * 180,
    withCredentials: true,
    maxContentLength: 5000,
    // 拦截请求
    requestInterceptors: (requestConfig) => {
      return requestConfig;
    },
    // 拦截响应
    responseInterceptors: (response) => {
      return response.data;
    },
  },
  /** 路由拦截 **/
  routerInterceptors(){
    console.log("路由切换正在渲染.")
  }
});
```

### 业务使用

```jsx | pure
import { initData } from 'lyr'; // 获取 initData
import { request } from 'lyr'; // 获取 request
```

## 配置

- 配置文件 ./lyr.config.ts

```ts
import { defineConfig } from 'lyr';

export default defineConfig({});
```

- 类型如下

```ts
import { Configuration } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

export interface ConfigProps {
  /** 标题 */
  title?: string;
  /** icon */
  favicon?: string;
  /** logo **/
  logo?: string;
  /** 底部描述信息 */
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
  webpackConfig?: (
    mode: 'development' | 'production' | undefined,
  ) => Configuration;
  /** 服务端入口，默认 ./src/apis */
  serverPath?: string;
}
```

## 开发

```shell
npm start
```

![dev](http://lyr-cli-oss.oss-cn-beijing.aliyuncs.com/assets/watch.png)

- 生成如下文件，默认端口 8361

```jsx
/www/dev/index.css
/www/dev/index.js
/www/dev/index.html
```

## 打包

```shell
npm run build
```

![build](http://lyr-cli-oss.oss-cn-beijing.aliyuncs.com/assets/build.png)

- 构建之后生成如下文件

```jsx
/www/build/index.css
/www/build/index.js
/www/build/index.html
```

## 使用 pm2 部署

- 安装 pm2 之后，运行 npm run deploy，完成部署

![deploy](http://lyr-cli-oss.oss-cn-beijing.aliyuncs.com/assets/deploy.png)
