'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const webpack = require('webpack')
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
  },
  output: {
    // webpack输出的目标文件夹路径（例如：/dist）
    path: config.build.assetsRoot,
    // webpack输出bundle文件命名格式，基于文件的md5生成Hash名称的script来防止缓存
    filename: '[name].js',
    // webpack编译输出的发布路径(判断是正式环境或者开发环境等)
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    //自动解析确定的拓展名,使导入模块时不带拓展名
    extensions: ['.js', '.vue', '.json','.scss','.css'],
    // 创建import或require的别名，一些常用的，路径长的都可以用别名
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      ...(config.dev.useEslint? [{
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: !config.dev.showEslintErrorsInOverlay
        }
      }] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          // outputPath:'images/',//将图片打包到images文件夹下
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins:[
    new webpack.ProvidePlugin({ 
      _:"underscore"
    }),
  ]
}
  // 图片路径问题 
  // 1.css中图片路径问题 url-loader 
  // 2.CSS分离与图片路径处理 配置插件 extract-text-webpack-plugin  
      // style-loader处理 {
      //         test: /\.css$/,
      //         use: extractTextPlugin.extract({
      //           fallback: "style-loader",
      //           use: "css-loader"
      //         })
      //       }
  // 3.publicPath 解决图片路径问题
  // 4.将图片打包到指定路径  在url-loader中配置 outputPath:'images/'
  // 5.解决的问题就是在hmtl文件中引入<img>标签的问题 html-withimg-loader
  //   {
  //     test: /\.(htm|html)$/i,
  //      use:[ 'html-withimg-loader'] 
  // }
  // CSS问题
  // 1.sass 文件打包并分离
  //   {
  //     test: /\.scss$/,
  //     use: extractTextPlugin.extract({
  //         use: [{
  //             loader: "css-loader"
  //         }, {
  //             loader: "sass-loader"
  //         }],
  //         // use style-loader in development
  //         fallback: "style-loader"
  //     })
  //  }
  // 2.配置提取CSS的loader配置
  //   {
  //     test: /\.css$/,
  //     use: extractTextPlugin.extract({
  //         fallback: 'style-loader',
  //         use: [
  //             { loader: 'css-loader', options: { importLoaders: 1 } },
  //             'postcss-loader'
  //         ]
  //     })
  // }
  // 3.消除未使用的css ：PurifyCSS 插件 	必须配合extract-text-webpack-plugin这个插件
  // npm i -D purifycss-webpack purify-css
  // const glob = require('glob');
  // const PurifyCSSPlugin = require("purifycss-webpack");
  // new PurifyCSSPlugin({
  //   // Give paths to parse for rules. These should be absolute!
  //   paths: glob.sync(path.join(__dirname, 'src/*.html')),
  // })
  // 优雅打包
  //  第三方类库打包  new webpack.ProvidePlugin({ $:"jquery"})
  // BannerPlugin插件 版权声明 new webpack.BannerPlugin('xx版权所有')
  // 多个第三方类库抽离
  //   new webpack.optimize.CommonsChunkPlugin({
  //     //name对应入口文件中的名字，我们起的是jQuery
  //     name:['jquery','vue'],
  //     //把文件打包到哪里，是一个路径
  //     filename:"assets/js/[name].js",
  //     //最小打包的文件模块数，这里直接写2就好
  //     minChunks:2
  // })
  //静态资源集中输出 copy-webpack-plugin