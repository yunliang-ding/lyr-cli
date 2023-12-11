/**
 * 插入静态资源
 */
class InsertCdnPlugin {
  private options: any;
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.environment.tap('InsertCdnPlugin', () => {
      console.log(this.options);
    });
  }
}

export default InsertCdnPlugin;
