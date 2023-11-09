const CracoLessPlugin = require('craco-less');

module.exports = {
  devServer: {
    port: 6015,
    // proxy for local development.
    proxy: {
      '/api': {
        target: 'http://localhost:6010',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api',
        },
      },
    },
  },
  plugins: [
    {
      // less loader.
      plugin: CracoLessPlugin,
      options: {
        // resolve-url-loader只对sass生效，craco-less默认使用sass配置，所以这里手动过滤掉resolve-url-loader
        modifyLessRule: (lessRule) => {
          lessRule.use = lessRule.use.filter(
            (i) => !i.loader.includes('resolve-url-loader')
          );
          return lessRule;
        },
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#215891' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
