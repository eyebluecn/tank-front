module.exports = {
  publicPath: "/",
  assetsDir: "static",
  devServer: {
    port: 6015,
    proxy: {
      '/api': {
        //target: 'https://tank.eyeblue.cn',
        target: 'http://127.0.0.1:6010',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  },
  lintOnSave: false,
  transpileDependencies: [
    'vue-echarts',
    'resize-detector'
  ]
}

