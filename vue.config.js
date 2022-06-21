const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? '/kaitu-image-editor' : '/',
  transpileDependencies: true,
  devServer: {
    open: true,
    port: 1234,
    compress: true
  },
  chainWebpack: config => {
    config.resolve.extensions
      .clear()
      .add('.vue')
      .add('.js')
      .add('.json')
    config.resolve.symlinks(true)
  },
  productionSourceMap: false
})
