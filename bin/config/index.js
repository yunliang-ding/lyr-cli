/*
  @dest: 使用配置文件
 */
module.exports = {
  npmUrl: "https://registry.npmjs.org/shc-cli/latest",
  projectList: [
    {
      type: "list",
      message: "请选择拉取的模版类型:",
      name: "type",
      choices: [
        {
          name: "react-base",
          value: {
            url: "https://github.com/yunliang-ding/react-base-template.git",
            gitName: "react-base-template",
            val: "react-base",
          },
        },
        {
          name: "react-mobx",
          value: {
            url: "https://github.com/yunliang-ding/react-mobx-template.git",
            gitName: "react-mobx-template",
            val: "react-mobx",
          },
        },
      ],
    },
  ],
};
