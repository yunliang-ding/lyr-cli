const fs = require('fs-extra');
const glob = require('glob');
const chokidar = require('chokidar');
const chalk = require('chalk');
const { resolve } = require('path');
const tempCode = require('./template/code');
const output = resolve(__dirname, `../../../../`);
const encodeStr = (str) => `#_#${str}#_#`;
const decodeStr = (str) => str.replaceAll('"#_#', '').replaceAll('#_#"', '');
/** 创建文件路由 */
const folder = `${output}/src/pages/**/*.tsx`;
const createFileRouter = async function (ignorePaths, sleep = true) {
  const files = glob.sync(folder);
  const importArr = [];
  const routes = files
    .filter((file) => {
      return !ignorePaths.some((i) => file.includes(i));
    })
    .map((file) => {
      let filePath = file.split('/src/pages')[1];
      let CompName = [];
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
  const outputFilePath = resolve(`${output}/router.tsx`);
  // 为了处理文件重命名的问题，采用了先删除 -> 延迟 -> 创建的兜底方案
  fs.removeSync(outputFilePath);
  if (sleep) {
    await new Promise((res) => setTimeout(res, 300));
  }
  fs.outputFile(outputFilePath, content);
};
/** 创建 .lyr */
exports.createLyr = function (ignorePaths = ['component/', 'components/']) {
  fs.outputFile(`${output}/src/.lyr/index.tsx`, tempCode.index);
  fs.outputFile(`${output}/src/.lyr/auth.tsx`, tempCode.auth);
  fs.outputFile(`${output}/src/.lyr/type.tsx`, tempCode.type);
  /** 创建路由 */
  createFileRouter(ignorePaths, false);
  /** 监听路由改动 */
  const watcher = chokidar.watch(folder, {
    ignored: /node_modules/,
    ignoreInitial: true,
  });
  watcher.on('add', async () => {
    createFileRouter(ignorePaths);
  });
  watcher.on('unlink', async () => {
    createFileRouter(ignorePaths);
  });
  console.log(chalk.green('=> create .lyr done.'));
};
/** 创建index.html */
exports.createIndexHtml = async function (option) {
  const isThinkjs = fs.existsSync(resolve(__dirname, `${output}/app/pm2.json`));
  const script =
    option.mode === 'development'
      ? [...option.devScript]
      : [...option.buildScript];
  const link = [...option.link];
  const mode = option.mode === 'development' ? 'dev' : 'build';
  if (isThinkjs) {
    link.push(`/${mode}/app.css`);
    script.push(`/${mode}/app.js`);
  } else {
    link.push('./app.css');
    script.push('./app.js');
  }
  const content = tempCode.indexHtml({
    ...option,
    mode: option.mode === 'development' ? 'dev' : 'build',
    link: link
      .map((i) => `<link rel="stylesheet" type="text/css" href="${i}" />`)
      .join('\n'),
    script: script
      .map((i) => `<script crossorigin src="${i}"></script>`)
      .join('\n'),
  });
  // 创建 index.html
  var outputFilePath =
    option.mode === 'development'
      ? `${output}/app/www/dev/index.html`
      : `${output}/app/www/build/index.html`;
  fs.outputFile(outputFilePath, content);
  console.log(chalk.green('=> create index.html done.'));
};
