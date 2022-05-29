let path = require('path')
const webpack = require('webpack')
const ThemeColorReplacer = require('webpack-theme-color-replacer')
const {getThemeColors, modifyVars} = require('./src/utils/themeUtil')
const {resolveCss} = require('./src/utils/theme-color-replacer-extend')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

const productionGzipExtensions = ['js', 'css']
const isProd = process.env.NODE_ENV === 'production'

const assetsCDN = {
  // webpack build externals
  externals: {
    // vue: 'Vue',
    // 'vue-router': 'VueRouter',
    // vuex: 'Vuex',
    // axios: 'axios',
    // nprogress: 'NProgress',
    // clipboard: 'ClipboardJS',
    // '@antv/data-set': 'DataSet',
    // 'js-cookie': 'Cookies'
  },
  css: [
  ],
  js: [
    // '//cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js',
    // '//cdn.jsdelivr.net/npm/vue-router@3.3.4/dist/vue-router.min.js',
    // '//cdn.jsdelivr.net/npm/vuex@3.4.0/dist/vuex.min.js',
    // '//cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js',
    // '//cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.min.js',
    // '//cdn.jsdelivr.net/npm/clipboard@2.0.6/dist/clipboard.min.js',
    // '//cdn.jsdelivr.net/npm/@antv/data-set@0.11.4/build/data-set.min.js',
    // '//cdn.jsdelivr.net/npm/js-cookie@2.2.1/src/js.cookie.min.js'
  ]
}

module.exports = {
  lintOnSave: false,

  devServer: {
    open:true,	// 是否自动弹出浏览器
    port:8000,	// 修改默认端口
    proxy: {	// 代理转发(服务器与服务器之间是不存在跨域的)
        "http://116.62.33.39:14578": {
            // 1 目标路径
            //重写路径为api
            target: "http://116.62.33.39:14578/",
            //2 允许跨域
            changOrigin: true,
            //3 重写路径
           
            secure: false, // 如果是https接口，需要配置这个参数
            ws:true,	   // 是否开启websockes协议请求
        },
        "/upload": {
          // 1 目标路径
          //重写路径为api
          target: "https://ppt.micromight.cn/upload/",
          //2 允许跨域
          changOrigin: true,
          //3 重写路径
          pathRewrite: {  // 这里理解成用‘/api’代替target里面的地址
              '^/upload': ''
          },
          secure: false, // 如果是https接口，需要配置这个参数
          ws:true,	   // 是否开启websockes协议请求
      }
    },
    
},
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, "./src/theme/theme.less")],
    }
  },
  configureWebpack: config => {
    config.entry.app = ["babel-polyfill", "whatwg-fetch", "./src/main.js"];
    config.performance = {
      hints: false
    }
    config.plugins.push(
      new ThemeColorReplacer({
        fileName: 'css/theme-colors-[contenthash:8].css',
        matchColors: getThemeColors(),
        injectCss: true,
        resolveCss
      })
    )
    // Ignore all locale files of moment.js
    config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
    // 生产环境下将资源压缩成gzip格式
    if (isProd) {
      // add `CompressionWebpack` plugin to webpack plugins
      config.plugins.push(new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }))
    }
    // if prod, add externals
    if (isProd) {
      config.externals = assetsCDN.externals
    }
  },
  chainWebpack: config => {
    // 生产环境下关闭css压缩的 colormin 项，因为此项优化与主题色替换功能冲突
    if (isProd) {
      config.plugin('optimize-css')
        .tap(args => {
            args[0].cssnanoOptions.preset[1].colormin = false
          return args
        })
    }
    // 生产环境下使用CDN
    if (isProd) {
      config.plugin('html')
        .tap(args => {
          args[0].cdn = assetsCDN
        return args
      })
    }
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: modifyVars(),
          javascriptEnabled: true
        }
      }
    }
  },
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false
}
