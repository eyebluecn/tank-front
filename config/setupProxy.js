const proxy = require('http-proxy-middleware');

module.exports = function (app) {

  //为了解决前端开发时跨域问题，配置后台接口代理。
  app.use(proxy(
    '/api',
    {
      target: 'http://localhost:6020',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api'
      }
    }
  ));

};
