![蓝眼云盘logo](https://raw.githubusercontent.com/eyebluecn/tank/master/build/doc/img/logo.png)

# 蓝眼云盘前端

##### [在线Demo](http://tank.eyeblue.cn) (体验账号： demo@tank.eyeblue.cn 密码：123456)

##### [配套后端tank](https://github.com/eyebluecn/tank)

### 简介
蓝眼云盘是 [蓝眼系列开源软件](https://github.com/eyebluecn) 中的第一个

- 主要用于快速搭建私人云盘，可以简单理解为部署在自己服务器上的[百度云盘](https://pan.baidu.com/)。
- 蓝眼云盘提供了[编程接口](https://github.com/eyebluecn/tank/blob/master/build/doc/alien_zh.md)，可以使用接口上传文件，作为其他网站、系统、app的资源存储器，可以当作单机版的[七牛云](https://www.qiniu.com)或[阿里云OSS](https://www.aliyun.com/product/oss)使用。在即将发布的[《蓝眼博客》](https://github.com/eyebluecn/blog)软件中将会有详细的使用。
- 蓝眼云盘还提供了账号管理系统，超级管理员可以管理用户，查看用户文件，普通用户只能查看自己的文件，修改自己的资料。上面提供的体验账号就是一个普通用户的账号。

蓝眼云盘可以作为团队内部或个人私有的云盘使用，亦可当作专门处理图片，音频，视频等二进制文件的第三方编程辅助工具。

如果您觉得蓝眼云盘对您有帮助，请不要吝惜您的star :smile:

### 技术栈

vue2.0 + vue-router + vuex + vue-resource + webpack + es6 + less


### 运行

```
npm install

npm run dev
```
如果你有自己的tank后端，也可以在`config/index.js`中`proxyTable.target`修改为自己tank所在地址

### 打包

```
npm run build
```
 打包的结果在`dist`文件夹下，将该文件夹下的内容放置在[后端tank](https://github.com/eyebluecn/tank)的`build/html`文件夹下即可。


### 配套后端
此项目有配套后端项目，对golang感兴趣的同学可以猛戳 [配套后端tank](https://github.com/eyebluecn/tank)

### 总结
1、 蓝眼的宗旨是专注于开源精致而优雅的软件，所以在代码的构建过程中我们不停地思考与迭代，追求最优质的代码。

2、 蓝眼云盘前端代码的构建完全面向对象，可扩展能力强，涉及多用户，多权限功能。
 
3、 蓝眼云盘后端采用了更贴近底层golang语言，更加适用于文件传输类的软件，速度更快，用户体验更好。  

### Contribution

感谢所有蓝眼云盘的贡献者 [@zicla](https://github.com/zicla)，[@seaheart](https://github.com/seaheart)，@heying，[@hxsherry](https://github.com/hxsherry)

如果您也想参与进来，请尽情的fork, star, post issue, pull requests

### 部分截图
![蓝眼云盘登录页面](https://raw.githubusercontent.com/eyebluecn/tank/master/build/doc/img/login.png)

![蓝眼云盘主要页面](https://raw.githubusercontent.com/eyebluecn/tank/master/build/doc/img/matters.png)

### 项目布局

```
├── build                                          // webpack配置文件
├── config                                         // 项目打包路径及反向代理配置
├── doc                                            // vue-cli创建后配置文档
├── node_modules                                   // 依赖包存放目录
├── screenshots                                    // 项目部分截图
├── node_modules                                   // 依赖包存放目录
├── static                                         // 打包文件存放目录
├── src                                            // 源码目录
│   ├── assets                                     // 静态资源
│   │   ├── css                                    // css目录
│   │   │   ├── bootstrap                          // bootstrap全局less
│   │   │   ├── global                             // 自定义全局less
│   │   │   ├── inspinia                           // 引用外部插件less
│   │   │   ├── mixin                              // bootstrap部分样式
│   │   │   ├── app.less                           // less入口文件
│   │   ├── img                                    // 静态图片存放目录
│   ├── backyard                                   // 组件目录
│   │   ├── layout                                 // 布局  
│   │   │   ├── BottomNavigation.vue               // 尾部布局
│   │   │   ├── SideMenu.vue                       // 侧边栏菜单
│   │   │   ├── SideNavigation.vue                 // 侧边栏布局
│   │   │   ├── TopNavigation.vue                  // 头部布局
│   │   ├── matter                                 // 文件
│   │   │   ├── widget                                                
│   │   │   │   ├── Director.js                    // 单个文件的导演类      
│   │   │   │   ├── FolderTree.vue                 // 文件夹递归树组件      
│   │   │   │   ├── MatterImage.vue                // 图片类型文件上传组件      
│   │   │   │   ├── MatterPanel.vue                // 单文件或文件夹个体     
│   │   │   │   ├── MoveBatchPanel.vue             // 批量文件移动组件      
│   │   │   │   ├── UploadMatterPanel.vue          // 文件上传组件 
│   │   │   ├── List.vue                           // 文件列表
│   │   ├── preference                             // 个性化
│   │   │   ├── Edit.vue                           // 个性化编辑
│   │   │   ├── Index.vue                          // 个性化显示
│   │   ├── user                                   // 用户
│   │   │   ├── widget                               
│   │   │   │   ├── UserInputSelection.vue         // 异步用户模糊单选组件      
│   │   │   ├── ChangePassword.vue                 // 用户修改密码
│   │   │   ├── Create.vue                         // 创建用户
│   │   │   ├── Detail.vue                         // 用户详情
│   │   │   ├── List.vue                           // 用户列表
│   │   │   ├── Login.vue                          // 用户登录
│   │   ├── widget                                 // 与页面有关的公用组件
│   │   │   ├── CreateSaveButton.vue               // 保存创建按钮组件
│   │   │   ├── LoadingFrame.vue                   // 框架加载组件
│   │   ├── Frame.vue                              // 大框架
│   ├── common                                     // 公共目录
│   │   ├── directive                              // 自定义指令
│   │   │   ├── directive.js                       // 验证规则指令
│   │   ├── filter                                 // 过滤器
│   │   │   ├── index.js                           // 过滤器入口文件
│   │   │   ├── number.js                          // 数字格式过滤器
│   │   │   ├── str.js                             // 字符串格式过滤器
│   │   │   ├── time.js                            // 时间格式过滤器
│   │   │   ├── validate.js                        // 正则表达式
│   │   ├── fork                                   // 引用外部插件
│   │   ├── frontend                               // 菜单
│   │   │   ├── Menu.js                            // 菜单类
│   │   │   ├── MenuManager.js                     // 菜单管理
│   │   ├── model                                  // 类模型目录
│   │   │   ├── base                               // 基
│   │   │   │   ├── Base.js                        // 基类
│   │   │   │   ├── BaseEntity.js                  // 实体基类
│   │   │   │   ├── Filter.js                      // 过滤器类
│   │   │   │   ├── Pager.js                       // 分页类
│   │   │   ├── feature                            // 权限
│   │   │   │   ├── FeatureType.js                 // 权限点类
│   │   │   ├── matter                             // 文件
│   │   │   │   ├── Matter.js                      // 文件类
│   │   │   ├── preference                         // 个性化
│   │   │   │   ├── Preference.js                  // 个性化类
│   │   │   ├── user                               // 用户
│   │   │   │   ├── User.js                        // 用户类
│   │   ├── router                                 // 路由
│   │   │   ├── index.js                           // 路由入口文件
│   │   ├── util                                   // 通用
│   │   │   ├── MimeUtil.js                        // 后缀名判别文件
│   │   │   ├── Utils.js                           // 客户端判别文件
│   │   ├── vuex                                   // vuex状态管理
│   │   │   ├── index.js                           // vuex入口文件
│   │   ├── widget                                 // 公用轮子文件（里面存放各种通用型轮子）
│   │   │   ├── filter                             // 筛选
│   │   │   │   ├── NbFilter.vue                   // 筛选入口组件
│   │   │   │   ├── NbFilterCheck.vue              // 单/多项选择筛选
│   │   │   │   ├── NbFilterDateTime.vue           // 时间筛选
│   │   │   │   ├── NbFilterHttpInputSelection.vue // 异步输入筛选
│   │   │   │   ├── NbFilterHttpSelection.vue      // 异步下拉筛选
│   │   │   │   ├── NbFilterMultiSelection.vue     // 多选下拉筛选
│   │   │   │   ├── NbFilterSelection.vue          // 下拉筛选
│   │   │   │   ├── NbFilterSort.vue               // 布尔值筛选
│   │   │   ├── NbBtnDropdown.vue                  // 按钮下拉组件
│   │   │   ├── NbCheckbox.vue                     // 复选框组件
│   │   │   ├── NbExpanding.vue                    // 收缩展开组件
│   │   │   ├── NbPager.vue                        // 分页组件
│   │   │   ├── NbRadio.vue                        // 单选框组件
│   │   │   ├── NbSlidePanel.vue                   // 动画组件
│   │   │   ├── NbSwitcher.vue                     // 开关按钮组件
│   ├── App.vue                                    // 页面入口文件
│   ├── main.js                                    // Js入口文件
├── index.html                                     // 入口Html文件

```

### License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2017-present, eyeblue.cn
