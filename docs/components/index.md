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


- 将视图层 Jsx 中所依赖的配置抽离成独立 schema 模块，避免后期不同人开发导致单个页面庞大不好维护

- 采用统一的开发模式，提高项目代码的统一性、可读性、在一定程度上即使你不会 React 也可以完成基础的 CRUD 的页面（后端同学）且代码风格一致

- 统一管理表单项，我们希望所有的表单被统一管理，我们能有入口可以拦截到，去做一些事情。


## 安装

> 组件库本身依赖 arco.design，使用需要同时安装 arco.design

```shell
npm install @arco-design/web-react --save
npm install lyr-cli --save
```

## 采用 cdn 引入

```html
<link
  rel="stylesheet"
  href="http://lyr-cli.oss-cn-beijing.aliyuncs.com/assets/lyr-cli.min.css"
/>
<script src="http://lyr-cli.oss-cn-beijing.aliyuncs.com/assets/lyr-cli.min.js"></script>
```

## 前提需要引入 cdn 前置依赖 到 window

```js
// window.React
<script src="https://g.alicdn.com/code/lib/react/17.0.2/umd/react.production.min.js"></script>
// window.ReactDOM
<script src="https://g.alicdn.com/code/lib/react-dom/17.0.2/umd/react-dom.production.min.js"></script>
// window.arco
<script src="https://unpkg.com/@arco-design/web-react@latest/dist/arco.min.js"></script>
// window.arcoicon
<script src="https://unpkg.com/@arco-design/web-react@latest/dist/arco-icon.min.js"></script>
// window.jsxRuntime
<script src="http://lyr-cli.oss-cn-beijing.aliyuncs.com/assets/jsx-runtime.polyfill.js"></script>
```

## 优势

- 基于 arco.design 的 Form 表单进行扩展、增强，编写好配置即可完成复杂的渲染和交互逻辑

- 扩展多种异步选择器的 `widgets`，可以满足大部分的查询场景用少量代码即可实现[ 点击查看](/components/form-advance#使用异步的-options)

- 内置组件，支持详情和编辑 2 种渲染模式可一键切换[ 点击查看](/components/form-base#使用-disabledreadonly)

- 通过支持自定义渲染、自定义组件的模式，可以 100%覆盖业务场景[ 点击查看](/components/form-advance#使用自定义渲染)


## 配置说明

> 我们将模型转为 Jsx 的过程中会做一些默认处理，减少配置，如下

- Input 开启计数器，最大长度 `64`
- 输入框 placeholder `请输入`，下拉框 placeholder `请选择`
- 输入框、选择框开启 `allowClear`
- FormItem required: true 等于 rules:[{required: true, message: `${label}不能为空`}]
- 下拉选配置了 showSearch 可实现模糊查询的功能不需要设置 filterOption
- 对于时间日期选择器，会自动进行 moment 和 string 的转化