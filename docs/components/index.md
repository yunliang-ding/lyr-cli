---
order: 1
title: 介绍
toc: menu
nav:
  title: 介绍
  order: 1
---

<div style="display:flex;align-items:center;margin-bottom:24px">
  <span style="font-size:30px;font-weight:600;display:inline-block;">lyr-cli</span>
</div>
<p style="display:flex;justify-content:space-between;width:220px">
  <a href="https://npmmirror.com/package/lyr-cli">
    <img alt="npm" src="http://center.yunliang.cloud/npm/version?package=lyr-cli">
  </a>
  <a href="https://npmmirror.com/package/lyr-cli">
    <img alt="NPM downloads" src="http://center.yunliang.cloud/npm/downloads?package=lyr-cli">
  </a>
</p>

## 设计初衷

- 提供一个高效的 `React` 开发框架，轻量化为主

- 实现一个更加适合团队开发习惯的一款定制化 `React` 框架

## 快速开始

- 在终端执行以下命令

```shell
yarn create lyr-cli new my-app
```

- 选择 base 模版

![demo](http://react-core-form.oss-cn-beijing.aliyuncs.com/assets/base1.png)

- 按照 README.md 启动服务如下、支持暗黑主题和主题切换

![demo](http://react-core-form.oss-cn-beijing.aliyuncs.com/assets/base2.png)

![demo](http://react-core-form.oss-cn-beijing.aliyuncs.com/assets/base3.png)

## 约定规范

### 路由

```jsx | pure
src/layouts // 页面壳子

src/pages/**/*.tsx // 路由文件

src/pages/403.tsx // 暂无权限

src/pages/404.tsx // 不存在

src/pages/error-boundary.tsx // 错误边界
```

### 路由鉴权

- 假设存在 /src/pages/admin.tsx

```jsx | pure
const Page = () => {
  return <div>仅管理员权限可见</div>;
};

Page.auth = '/admin/list'; // 配置了 auth 则表示需要做鉴权，具体 auth 在下面的 getInitData 方法中返回

export default Page;
```

### 样式

- 默认引入 src/global.less

### 入口

- 入口文件 src/app.tsx

```jsx | pure
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
});
```

## 业务使用

```jsx | pure
import { initData } from 'lyr'; // 获取 initData
import { request } from 'lyr'; // 获取 request
```

## 配置

- 配置文件 src/lyr-config.ts

```ts | pure
import { defineConfig } from 'lyr-cli';

export default defineConfig({});
```

- 类型如下

```ts | pure
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
  /** 资源包分析配置，仅开发模式启用 */
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
```

## 开发环境

```shell
npm start
```

![dev](http://react-core-form.oss-cn-beijing.aliyuncs.com/assets/dev.png)

- 持续监听

```jsx | pure
./app/www/dev // 输出位置

app.css
app.js
index.html
```

## 部署发布

```shell
npm run build
```

![dev](http://react-core-form.oss-cn-beijing.aliyuncs.com/assets/build.png)

- 会输出如下结构的资源文件到

```jsx | pure

./app/www/build // 输出位置

app.css
app.js
index.html
```
