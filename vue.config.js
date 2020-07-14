const theme = process.env.npm_config_model
const path = require('path')
module.exports = {
  productionSourceMap: false,
  pages: {
    index: path.join(__dirname, `./src/${theme}/app.js`)
  },
  outputDir: `dist/${theme}`,
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  configureWebpack: {
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        'public': path.join(__dirname, './public')
      }
    }
  },
  chainWebpack: config => {
    config
      .plugin('html-index')
      .tap(args => {
        args[0].template = path.join(__dirname, `./src/${theme}/index.html`)
        return args
      })
    config.plugin('copy').tap(args => {
      args[0].push({
        from: path.join(__dirname, `./src/${theme}/config.js`),
        to: path.join(__dirname, `./dist/${theme}`)
      })
      return args
    })
  },
  transpileDependencies: [
    'vue-echarts',
    'resize-detector'
  ]
}
