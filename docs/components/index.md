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

- 默认约定规则如下，当文件名变化，触发自动更新

```jsx | pure
src/layouts // 页面壳子

src/pages/**/*.tsx // 路由文件

src/pages/**/$id.tsx // 动态路由

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

### 路由缓存

- 假设存在 /src/pages/user.tsx

```jsx | pure
const Page = () => {
  return <div>缓存路由</div>;
};

Page.keeplive = true; // 开启缓存功能

export default Page;
```

## 全局样式

- 默认引入 src/global.less

## 入口文件

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

### 业务使用

```jsx | pure
import { initData } from 'lyr'; // 获取 initData
import { request } from 'lyr'; // 获取 request
```

## 配置

- 配置文件 ./lyr.config.ts

```ts | pure
import { defineConfig } from 'lyr';

export default defineConfig({});
```

- 类型如下

```ts | pure
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
  /** oss 配置 */
  ossConfig?: {
    bucket: string;
    region: string;
    accessKeyId: string;
    accessKeySecret: string;
  };
  /** dev-server 配置 */
  devServer?: DevServerConfiguration;
  /** webpack 配置 */
  webpackConfig?: (
    mode: 'development' | 'production' | undefined,
  ) => Configuration;
  mode?: 'development' | 'production';
}
```

## 单一应用 base 模版

### 开发

```shell
npm start
```

![dev](http://react-core-form.oss-cn-beijing.aliyuncs.com/assets/dev.png)

- 基于 webpack-dev-server 自动生成 /public/index.html

### 打包

```shell
npm run build
```

![dev](http://react-core-form.oss-cn-beijing.aliyuncs.com/assets/build.png)

- 构建之后生成如下文件

```jsx | pure
/build/app.css
/build/app.js
/build/index.html
```

## 全栈应用 pro 模版

### 开发

```shell
npm run watch
```

![dev](http://react-core-form.oss-cn-beijing.aliyuncs.com/assets/watch.png)

- 生成如下文件并持续监听文件改动

```jsx | pure
/app/www/dev/app.css
/app/www/dev/app.js
/app/www/dev/index.html
```

```shell
cd app & npm start;
```

![dev](http://react-core-form.oss-cn-beijing.aliyuncs.com/assets/pro-build2.png)

- 访问上面服务地址即可[基于 thinkjs3.x](https://thinkjs.org/doc/index.html)

### 打包

```shell
npm run build
```

![dev](http://react-core-form.oss-cn-beijing.aliyuncs.com/assets/pro-build.png)

- 构建之后生成如下文件

```jsx | pure
/app/www/build/app.css
/app/www/build/app.js
/app/www/build/index.html
```

### pm2 部署

- 安装 pm2 之后，项目根目录运行 ./deploy.sh，完成部署
