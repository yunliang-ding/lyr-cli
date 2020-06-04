#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const commander = require('commander');
const inquirer = require('inquirer');
const checkDire = require('./bin/utils');
const { exec } = require('child_process');
const { version } = require('./package.json');
const { projectList } = require('./bin/config');

//version 版本号
commander.version(version, '-v, --version')
  .command('init <projectName>')
  .alias("i")
  .description("输入项目名称，初始化项目模版")
  .action(async (projectName, cmd) => {
    await checkDire(path.join(process.cwd(), projectName), projectName);   // 检测创建项目文件夹是否存在
    inquirer.prompt(projectList).then(result => {
      const { url, gitName, val } = result.type;
      console.log("您选择的模版类型信息如下：" + val);
      console.log('项目初始化拷贝获取中...');
      if (!url) {
        console.log(chalk.red(`${val} 该类型暂不支持...`));
        process.exit(1);
      }
      exec('git clone ' + url, function (error, stdout, stderr) {
        if (error !== null) {
          console.log(chalk.red(
            `clone fail,${error}`
          ));
          return;
        }
        fs.rename(gitName, projectName, (err) => {
          if (err) {
            exec('rm -rf ' + gitName, function (err, out) { });
            console.log(chalk.red(`The ${projectName} project template already exist`));
          } else {
            exec(`rm -rf ${projectName}/.git`, function (err, out) { }); // 删除 .git
            console.log(chalk.green(`The ${projectName} project template successfully create(项目模版创建成功)`));
            console.log(chalk.green('enter path:'))
            console.log(chalk.green(`$ cd ${projectName}`))
            console.log(chalk.green('$ npm install'))
            console.log(chalk.green('run the app:'))
            console.log(chalk.green('$ npm start'))
          }
        });
      });
    })
  });
commander.parse(process.argv);