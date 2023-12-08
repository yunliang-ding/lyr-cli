const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const chokidar = require('chokidar');
const tempCode = require('./template/code');

const encodeStr = (str) => {
  return `#_#${str}#_#`;
};
const decodeStr = (str) => {
  return str.replaceAll('"#_#', '').replaceAll('#_#"', '');
};
let initialFlag = false;
/** 创建文件路由 */
const folder = path.resolve(__dirname, '../../src/pages/**/*.tsx');
const output = path.resolve(__dirname, '../../src/.app');
/** 创建主体文件 */
const createTemplateCode = () => {
  fs.outputFile(path.resolve(`${output}/index.tsx`), tempCode.index);
  fs.outputFile(path.resolve(`${output}/auth.tsx`), tempCode.auth);
};
/** 创建路由 */
const createFileRouter = async (
  ignorePaths = ['component/', 'components/'],
  sleep = true, // 是否等待
) => {
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
  routerConfig = `export default ${decodeStr(JSON.stringify(routes, null, 2))}`;
  const content = `${importArr.join('\n')}\n\n${routerConfig}`;
  const outputFilePath = path.resolve(`${output}/router.tsx`);
  // 为了处理文件重命名的问题，采用了先删除 -> 延迟 -> 创建的兜底方案
  fs.removeSync(outputFilePath);
  if (sleep) {
    await new Promise((res) => setTimeout(res, 300));
  }
  fs.outputFile(outputFilePath, content);
};

class FileRouterPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.environment.tap('FileRouterPlugin', () => {
      if (initialFlag === false) {
        // 首次编译创建
        createTemplateCode();
        createFileRouter(this.options.ignorePaths, false);
        const watcher = chokidar.watch('src/pages', {
          ignored: /node_modules/,
          ignoreInitial: true,
        });
        watcher.on('add', async (path) => {
          createFileRouter(this.options.ignorePaths);
        });
        watcher.on('unlink', async (path) => {
          createFileRouter(this.options.ignorePaths);
        });
      }
      initialFlag = true;
    });
  }
}

module.exports = FileRouterPlugin;
