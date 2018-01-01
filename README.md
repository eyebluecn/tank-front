![蓝眼云盘logo](https://raw.githubusercontent.com/eyebluecn/tank/dev/build/doc/logo.png)

# 蓝眼云盘前端

##### [在线Demo](http://tank.eyeblue.cn)

##### [配套后端tank](https://github.com/eyebluecn/tank)

### 简介
蓝眼云盘是 [蓝眼系列开源软件](https://github.com/eyebluecn) 中的第一个

- 主要用于快速搭建私人云盘，可以简单理解为部署在自己服务器上的[百度云盘](https://pan.baidu.com/)。
- 蓝眼云盘提供了编程接口，可以使用接口上传文件，作为其他网站、系统、app的资源存储器，可以当作单机版的[七牛云](https://www.qiniu.com)或[阿里云OSS](https://www.aliyun.com/product/oss)使用。

蓝眼云盘可以作为团队内部或个人私有的云盘使用，亦可当作专门处理图片，音频，视频等二进制文件的第三方编程辅助工具。

如果您觉得蓝眼云盘对您有帮助，请不要吝惜您的star :smile:

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

 #### 更多详细配置请参考[后端说明](https://github.com/eyebluecn/tank)

### Contribution

感谢所有蓝眼云盘的贡献者 [@zicla](https://github.com/zicla)，[@seaheart](https://github.com/seaheart)，@heying，[@hxsherry](https://github.com/hxsherry)

如果您也想参与进来，请尽情的fork, star, post issue, pull requests

### License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2017-present, eyeblue.cn
