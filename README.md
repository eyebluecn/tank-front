# 博客前端项目

> 配套后端`tank`

## 构建过程

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build


//查看本地项目连接的远端目录

git remote -v


//如果没有upstream，即没有原作者项目的url，你需要自己添加

git remote add upstream <原作者项目的URL>


//将原作者项目更新的内容同步到我的本地项目（不是我Github网上的项目）

git fetch upstream


//接下来就是合并这两个分支，将原作者项目的修改同步到自己这里（注意还是指本地项目，不是自己Github空间里的项目）

git merge upstream/master

//想要让自己远端就使用push操作将本地的代码推到自己的远端仓库

git push origin master

//如果希望让原作者合并自己修改，那么就需要去github上创建pull request.
