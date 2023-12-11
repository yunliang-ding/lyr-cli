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

- 实现一个更加适合自己开发习惯的一款定制化 `React` 框架

## 快速开始

```shell
yarn install lyr-cli -D
```

## 约定规范

### 路由

```jsx | pure
src/layouts.tsx // 页面壳子

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
import { auth } from 'lyr'; // 获取 auth

import { initData } from 'lyr'; // 获取 initData

import { request } from 'lyr'; // 获取 request
```

## 配置

- 配置文件 src/lyr-config.ts

```jsx | pure
import { defineConfig } from 'lyr-cli';

export default defineConfig({
  router: {
    ignore: ['schema-'],
  },
  /** 是否开启资源包分析 */
  bundleAnalyzer: {
    // host: '',
  },
  // cdn 资源
  cdn: (mode) => {
    return mode === 'dev'
      ? [
          'https://react-core-form.oss-cn-beijing.aliyuncs.com/cdn/react.development.min.js',
          'https://react-core-form.oss-cn-beijing.aliyuncs.com/cdn/react-dom.development.min.js',
          'https://react-core-form.oss-cn-beijing.aliyuncs.com/cdn/arco.min.css',
          'https://react-core-form.oss-cn-beijing.aliyuncs.com/cdn/react-core-form.min.css',
        ]
      : [
          'https://react-core-form.oss-cn-beijing.aliyuncs.com/cdn/react.production.min.js',
          'https://react-core-form.oss-cn-beijing.aliyuncs.com/cdn/react-dom.production.min.js',
          'https://react-core-form.oss-cn-beijing.aliyuncs.com/cdn/arco.min.css',
          'https://react-core-form.oss-cn-beijing.aliyuncs.com/cdn/react-core-form.min.css',
        ];
  },
  /** 部署的时候直接同步一份到 oss */
  ossConfig: {
    bucket: 'xxx',
    region: 'xxx',
    accessKeyId: 'xxx',
    accessKeySecret: 'xxx',
  },
  /** merge webpack 配置 */
  webpackConfig: (mode) => ({
    externals: {
      react: 'React',
      'react-dom': 'reactDOM',
    },
  }),
});
```

## tsconfig.json

```json
{
  "compilerOptions": {
    "path": {
      "lyr": ["./src/.lyr"]
    }
  }
}
```

## package.json

```json
{
  "scripts": {
    "start": "lyr dev",
    "build": "lyr build"
  }
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

css/min.css
app.js
```

## 部署发布

```shell
npm run build
```

![dev](http://react-core-form.oss-cn-beijing.aliyuncs.com/assets/build.png)

- 会输出如下结构的资源文件到

```jsx | pure

./app/www/build // 输出位置

css/min.css
app.js
```
