import { resolve } from 'path';
import * as fs from 'fs-extra';

const getHtmlContent = ({ favicon, title, script, link }) => `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="${favicon}" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
${link}
</head>

<body>
  <div id="root" />
</body>
${script}
</html>`;

const rootPath = '../../../../';
const isThinkjs = fs.existsSync(resolve(__dirname, `${rootPath}/app/pm2.json`));

class HtmlTemplatePlugin {
  private options: any;
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.emit.tapAsync('HtmlTemplatePlugin', (compilation, cb) => {
      // 创建 index.html
      compilation.assets['index.html'] = {
        source: () => {
          const script =
            this.options.mode === 'development'
              ? [...this.options.devScript]
              : [...this.options.buildScript];
          const link = [...this.options.link];
          const mode = this.options.mode === 'development' ? 'dev' : 'build';
          if (isThinkjs) {
            link.push(`/${mode}/app.css`);
            script.push(`/${mode}/app.js`);
          } else {
            link.push(`./app.css`);
            script.push(`./app.js`);
          }
          return getHtmlContent({
            ...this.options,
            isThinkjs,
            mode: this.options.mode === 'development' ? 'dev' : 'build',
            link: link
              .map(
                (i) => `<link rel="stylesheet" type="text/css" href="${i}" />`,
              )
              .join('\n'),
            script: script
              .map((i) => `<script crossorigin src="${i}"></script>`)
              .join('\n'),
          });
        },
      };
      cb();
    });
  }
}

export default HtmlTemplatePlugin;
