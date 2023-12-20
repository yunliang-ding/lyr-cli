import { resolve } from 'path';
import * as fs from 'fs-extra';
import * as chalk from 'chalk';

const rootPath = '../../../../';

const isThinkjs = fs.existsSync(resolve(__dirname, `${rootPath}/app/pm2.json`));

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

class HtmlTemplatePlugin {
  private options: any;
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.environment.tap('HtmlTemplatePlugin', function () {
      console.log(chalk.green('=> 创建 index.html'));
    });
    compiler.hooks.emit.tapAsync('HtmlTemplatePlugin', (compilation, cb) => {
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
      const content = getHtmlContent({
        ...this.options,
        mode: this.options.mode === 'development' ? 'dev' : 'build',
        link: link
          .map((i) => `<link rel="stylesheet" type="text/css" href="${i}" />`)
          .join('\n'),
        script: script
          .map((i) => `<script crossorigin src="${i}"></script>`)
          .join('\n'),
      });
      // 创建 index.html
      var outputFilePath =
        this.options.mode === 'development'
          ? resolve(__dirname, `${rootPath}/app/www/dev/index.html`)
          : resolve(__dirname, `${rootPath}/app/www/build/index.html`);
      fs.outputFile(outputFilePath, content);
      cb();
    });
  }
}

export default HtmlTemplatePlugin;
