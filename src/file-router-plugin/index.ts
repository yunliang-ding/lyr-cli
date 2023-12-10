import { resolve } from 'path';
import fs from "fs-extra";
import glob from "glob";
import chokidar from "chokidar";
import tempCode from "./template/code";
import { rootPath } from '..';

const encodeStr = (str) => {
  return `#_#${str}#_#`;
};
const decodeStr = (str) => {
  return str.replaceAll('"#_#', "").replaceAll('#_#"', "");
};
let initialFlag = false;
/** 创建文件路由 */
const folder = resolve(__dirname, `${rootPath}/src/pages/**/*.tsx`);
const output = resolve(__dirname, `${rootPath}/src/.lyr`);
/** 创建主体文件 */
const createTemplateCode = () => {
  fs.outputFile(resolve(`${output}/index.tsx`), tempCode.index);
  fs.outputFile(resolve(`${output}/auth.tsx`), tempCode.auth);
};
/** 创建路由 */
const createFileRouter = async (
  ignorePaths = ["component/", "components/"],
  sleep = true // 是否等待
) => {
  const files = glob.sync(folder);
  const importArr: any = [];
  const routes = files
    .filter((file) => {
      return !ignorePaths.some((i) => file.includes(i));
    })
    .map((file) => {
      let filePath: any = file.split("/src/pages")[1];
      let CompName: any = [];
      let path = "";
      filePath = filePath.substring(0, filePath.lastIndexOf("."));
      if (filePath === "/index") {
        filePath = "/index";
        path = "/";
        CompName = ["R"];
      } else {
        if (filePath.endsWith("/index")) {
          filePath = filePath.substring(0, filePath.length - 6); // 移除 index
        }
        CompName = `${filePath
          .replaceAll("/", "")
          .replaceAll("$", "")
          .replaceAll("-", "")
          .replaceAll(" ", "")}`.split("");
        // 字母开头
        if (/[a-zA-Z]/.test(CompName[0])) {
          CompName[0] = CompName[0].toUpperCase();
        } else {
          CompName.unshift("R");
        }
        path = filePath.replaceAll("$", ":");
      }
      importArr.push(`import ${CompName.join("")} from '@/pages${filePath}';`); // 添加依赖
      return {
        path,
        component: encodeStr(`<${CompName.join("")} />`),
      };
    });
  const routerConfig = `export default ${decodeStr(JSON.stringify(routes, null, 2))}`;
  const content = `${importArr.join("\n")}\n\n${routerConfig}`;
  const outputFilePath = resolve(`${output}/router.tsx`);
  // 为了处理文件重命名的问题，采用了先删除 -> 延迟 -> 创建的兜底方案
  fs.removeSync(outputFilePath);
  if (sleep) {
    await new Promise((res) => setTimeout(res, 300));
  }
  fs.outputFile(outputFilePath, content);
};

class FileRouterPlugin {
  private options: any;
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.environment.tap("FileRouterPlugin", () => {
      if (initialFlag === false) {
        // 首次编译创建
        createTemplateCode();
        createFileRouter(this.options.ignorePaths, false);
        const watcher = chokidar.watch("src/pages", {
          ignored: /node_modules/,
          ignoreInitial: true,
        });
        watcher.on("add", async (path) => {
          createFileRouter(this.options.ignorePaths);
        });
        watcher.on("unlink", async (path) => {
          createFileRouter(this.options.ignorePaths);
        });
      }
      initialFlag = true;
    });
  }
}

export default FileRouterPlugin;
