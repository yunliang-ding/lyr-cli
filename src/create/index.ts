import * as fs from 'fs-extra';
import * as glob from 'glob';
import * as chokidar from 'chokidar';
import chalk from 'chalk';
import { resolve } from 'path';
import { auth, getIndexHtml, index, type } from './template/code';
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
  const script = [...(cdn || []), `/${mode}/index.js`];
  const link = [...(config.link || []), `/${mode}/index.css`];
  // 开启 liveReload
  let liveReload = '';
  if (mode === 'dev') {
    liveReload = `<script>
    // 由 lyr-cli 在开发环境所创建
    window.__lyrcli_version__ = "${config.version}";
    window.onload = () => {
      if ('WebSocket' in window) {
        let ws = new WebSocket(\`ws://$\{location.hostname\}:${config.wsPort}/websocket\`);
        ws.onmessage = (message) => {
          if (message.data === "1") {
            location.reload();
          } else {
            const iframe = document.createElement('iframe');
            iframe.id = "lyr-cli-client-overlay"
            iframe.style = "padding: 20px;background: #222;opacity: .9;position: fixed; inset: 0px; width: 100vw; height: 100vh; border: none; z-index: 2147483647;"
            document.body.appendChild(iframe);
            document.querySelector("#lyr-cli-client-overlay").contentWindow.document.body.innerHTML = \`
                    <div style="font-size: 20px;color: red;margin-bottom: 20px;">编译异常</div>
                    <div id="close" style="cursor: pointer; position: fixed; top: 0; right: 40px;"><svg viewBox="0 0 1024 1024" width="18" height="18"><path d="M512 421.490332 331.092592 240.582924C306.351217 215.841549 265.464551 215.477441 240.470996 240.470996 215.303191 265.638801 215.527553 306.037221 240.582924 331.092592L421.490332 512 240.582925 692.907407C215.84155 717.648782 215.477441 758.535449 240.470996 783.529004 265.638801 808.696809 306.037222 808.472446 331.092593 783.417075L512 602.509668 692.907407 783.417075C717.648782 808.15845 758.535449 808.522559 783.529004 783.529004 808.696809 758.361199 808.472446 717.962778 783.417075 692.907407L602.509668 512 783.417076 331.092592C808.158451 306.351217 808.522559 265.464551 783.529004 240.470996 758.361199 215.303191 717.962779 215.527553 692.907408 240.582924L512 421.490332Z" fill="#fff"></path></svg></div>
                    <pre style="color: red; margin: 10px 0">$\{message.data\}</pre>
                  \`;
            document.querySelector("#lyr-cli-client-overlay").contentWindow.document.querySelector("#close").addEventListener('click', () => {
              document.querySelector("#lyr-cli-client-overlay").remove()
            })
          }
        };
      }
    };
</script>`;
  }
  const content = getIndexHtml({
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
