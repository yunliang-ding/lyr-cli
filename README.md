dyl-cli 
> 前端脚手架命令工具

如何安装
```
npm install dyl-cli -g
```


初始化命令
```
dyl-cli init <projectName>
// 选择 mobile 或者 pc 的模版

或者
dyl-cli  i <projectName>
```

版本号查看
```
dyl-cli -v
```
# git仓库
```
4.添加远程仓库
git remote add origin https://XXX.git

5.本地仓库也远程仓库关联
git fetch // 拉取远程分之
git checkout -b master
git checkout master // 切换到master分支
git branch --set-upstream-to=origin/master master

6.拉取远程仓库内容到本地
这时候用git pull会提示(毕竟本地和远程仓库没啥关系指针连接不起来的缘故吧)：

fatal: refusing to merge unrelated histories

因此命令应该改为：

git pull origin master --allow-unrelated-histories  

7.将最新的内容推送到远程仓库
git push
```