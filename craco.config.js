const CracoLessPlugin = require('craco-less');

module.exports = {
  devServer: {

    // proxy for local development.
    proxy: {
      '/api': {
        target: 'http://localhost:6010',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    },
  },
  plugins: [
    {

      // less loader.
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {'@primary-color': '#215891'},
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
