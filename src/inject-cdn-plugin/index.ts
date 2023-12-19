const staticScript = `function _loadScriptJs_(src){var script=document.createElement('script');script.src=src;script.setAttribute('crossorigin',"");document.head.appendChild(script)}function _loadLinkCss_(href){var link=document.createElement('link');link.href=href;link.type="text/css";link.rel="stylesheet";document.head.appendChild(link)}`;
const createCdnScript = (cdn) =>
  cdn.map((item) =>
    item.endsWith('.js')
      ? `_loadScriptJs_("${item}")`
      : `_loadLinkCss_("${item}")`,
  );

class InjectCdnPlugin {
  private options: any;
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.emit.tapAsync('InjectCdnPlugin', function (compilation, cb) {
      const content = [
        staticScript,
        createCdnScript(this.options.cdn),
        // 等cdn加载完之后再执行，这里默认等2秒
        `setTimeout(function(){
          ${compilation.assets['app.js'].source()}
        }, 2000)`,
      ];
      compilation.assets['app.js'] = {
        source: function () {
          return content.join(';');
        },
        size: function () {
          return content.join(';').length;
        },
      };
      cb();
    });
  }
}

export default InjectCdnPlugin;
