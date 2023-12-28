import * as fs from 'fs-extra';
import * as glob from 'glob';
import * as chokidar from 'chokidar';
import * as chalk from 'chalk';
import { resolve } from 'path';
import { auth, indexHtml, index, type } from './template/code';
import { ConfigProps } from '../type';

const encodeStr = (str) => `#_#${str}#_#`;
const decodeStr = (str) => str.replaceAll('"#_#', '').replaceAll('#_#"', '');
/** 创建文件路由 */
const createFileRouter = async function (
  rootPath = '',
  ignorePaths,
  sleep = true,
) {
  const folder = `${rootPath}/src/pages/**/*.tsx`;
  const files = glob.sync(folder);
  const importArr: any = [];
  const routes = files
    .filter((file) => {
      return !ignorePaths.some((i) => file.includes(i));
    })
    .map((file) => {
      let filePath: any = file.split('/src/pages')[1];
      let CompName: string[] = [];
      let path = '';
      filePath = filePath.substring(0, filePath.lastIndexOf('.'));
      if (filePath === '/index') {
        filePath = '/index';
        path = '/';
        CompName = ['R'];
      } else {
        if (filePath.endsWith('/index')) {
          filePath = filePath.substring(0, filePath.length - 6); // 移除 index
        }
        CompName = `${filePath
          .replaceAll('/', '')
          .replaceAll('$', '')
          .replaceAll('-', '')
          .replaceAll('.', '')
          .replaceAll(' ', '')}`.split('');
        // 字母开头
        if (/[a-zA-Z]/.test(CompName[0])) {
          CompName[0] = CompName[0].toUpperCase();
        } else {
          CompName.unshift('R');
        }
        path = filePath.replaceAll('$', ':');
      }
      importArr.push(`import ${CompName.join('')} from '@/pages${filePath}';`); // 添加依赖
      return {
        path,
        component: encodeStr(`<${CompName.join('')} />`),
      };
    });
  const routerConfig = `export default ${decodeStr(
    JSON.stringify(routes, null, 2),
  )}`;
  const content = `${importArr.join('\n')}\n\n${routerConfig}`;
  const outputFilePath = resolve(`${rootPath}/src/.lyr/router.tsx`);
  // 为了处理文件重命名的问题，采用了先删除 -> 延迟 -> 创建的兜底方案
  fs.removeSync(outputFilePath);
  if (sleep) {
    await new Promise((res) => setTimeout(res, 300));
  }
  fs.outputFile(outputFilePath, content);
};
/** 创建 .lyr */
export const createLyr = function (
  rootPath = '',
  ignorePaths = ['component/', 'components/'],
) {
  fs.outputFile(`${rootPath}/src/.lyr/index.tsx`, index);
  fs.outputFile(`${rootPath}/src/.lyr/auth.tsx`, auth);
  fs.outputFile(`${rootPath}/src/.lyr/type.tsx`, type);
  /** 创建路由 */
  createFileRouter(rootPath, ignorePaths, false);
  /** 监听路由改动 */
  const watcher = chokidar.watch(`${rootPath}/src/pages/**/*.tsx`, {
    ignored: /node_modules/,
    ignoreInitial: true,
  });
  watcher.on('add', async () => {
    createFileRouter(rootPath, ignorePaths);
  });
  watcher.on('unlink', async () => {
    createFileRouter(rootPath, ignorePaths);
  });
  console.log(chalk.green('=> create .lyr done.'));
};
/** 创建index.html */
export const createIndexHtml = async function (
  rootPath = '',
  config: ConfigProps,
) {
  const mode = config.mode === 'development' ? 'dev' : 'build';
  const cdn = mode === 'dev' ? config.devScript : config.buildScript;
  const script = [...(cdn || []), `/${mode}/app.js`];
  const link = [...(config.link || []), `/${mode}/app.css`];
  // 全栈开发开启 liveReload
  let liveReload = '';
  if (mode === 'dev') {
    liveReload = `<script>
  window.onload = () => {
    if ('WebSocket' in window) {
      let ws = new WebSocket(\`ws://$\{location.hostname\}:${config.wsPort}/websocket\`);
      ws.onopen = () => {
        ws.send('开启 liveReload.');
      };
      ws.onmessage = (message) => {
        console.log(\`%c $\{message.data\}\`, 'color:green;');
        location.reload();
      };
    }
  };
</script>`;
  }
  const content = indexHtml({
    favicon: config.favicon,
    title: config.title,
    link: link
      .map((i) => `<link rel="stylesheet" type="text/css" href="${i}" />`)
      .join('\n'),
    script: script
      .map((i) => `<script crossorigin src="${i}"></script>`)
      .join('\n'),
    liveReload,
  });
  fs.outputFile(`${rootPath}/www/${mode}/index.html`, content);
  console.log(chalk.green('=> create index.html done.'));
};
