/*
  @dest: 使用配置文件
 */
module.exports = {
  npmUrl: 'https://registry.npmjs.org/shc-cli/latest',
  projectList: [{
    type: 'list',
    message: '请选择拉取的模版类型:',
    name: 'type',
    choices: [{
      name: 'mobile',
      value: {
        url: 'https://github.com/yunliang-ding/react-mobile-template.git',
        gitName: 'react-mobile-template',
        val: '移动端模版'
      }
    }, {
      name: 'pc',
      value: {
        url: 'https://github.com/yunliang-ding/react-pc-template.git',
        gitName: 'react-pc-template',
        val: 'PC端模版'
      }
    }]
  }],
};
