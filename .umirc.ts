import { defineConfig } from 'dumi';

export default defineConfig({
  mode: 'site',
  title: 'lyr-cli',
  outputPath: 'docs-dist',
  favicon:
    'https://unpkg.byted-static.com/latest/byted/arco-config/assets/favicon.ico',
  logo: 'https://unpkg.byted-static.com/latest/byted/arco-config/assets/favicon.ico',
  metas: [
    {
      name: 'keywords',
      content: '轻量级 react 脚手架',
    },
    {
      name: 'description',
      content: 'react 脚手架',
    },
  ],
  theme: {
    '@c-primary': '#165dff',
  },
  history: { type: 'hash' },
  hash: false,
  navs: [
    null, // null 值代表保留约定式生成的导航，只做增量配置
    {
      title: '🔥 react-core-form 2.x',
      path: 'http://dev-ops.yunliang.cloud/website/react-core-form',
    },
    {
      title: 'GitHub',
      path: 'https://github.com/yunliang-ding/lyr-cli',
    },
  ],
  apiParser: {
    // 自定义属性过滤配置，也可以是一个函数，用法参考：https://github.com/styleguidist/react-docgen-typescript/#propfilter
    propFilter: {
      // 是否忽略从 node_modules 继承的属性，默认值为 false
      skipNodeModules: true,
      // 需要忽略的属性名列表，默认为空数组
      skipPropsWithName: [],
      // 是否忽略没有文档说明的属性，默认值为 false
      skipPropsWithoutDoc: true,
    },
  },
});
