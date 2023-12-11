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

- 提供一个高效的 `React` 开发框架，代替 umijs、icejs 等，主要是面向简洁化，不需要一些花里胡哨的配置

- 实现一个更加适合自己开发习惯的一款定制化 `React` 框架

## 快速开始

```shell
yarn install lyr-cli -D
```

## 约定式路由

- 默认开启约定式路由，如过配置了 src/router.tsx 则会按照配置的方式

## 默认安装依赖

```json
{
  "dependencies": {
    "axios": "1.6.2",
    "react": "17.0.2",
    "react-dom": "17.0.2",
    "react-router-dom": "6.20.0",
    "@arco-design/web-react": "2.56.0",
    "react-core-form": "2.1.0",
    "react-core-form-store": "^0.0.2",
    "react-fast-marquee": "1.3.2",
    "nprogress": "^0.2.0",
    "react-color": "2.19.3"
  },
}
```
