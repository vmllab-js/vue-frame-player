module.exports = {
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'assets',
  indexPath: 'index.html',
  filenameHashing: false,
  lintOnSave: false,
  chainWebpack: config => {
    config
      .plugin( 'html' )
      .tap( args => {
        args[ 0 ].title = 'VueFramePlayer'
        return args
      } )
    const imagesRule = config.module.rule( 'images' )
    imagesRule.uses.clear()
    imagesRule.use( 'file-loader' )
      .loader( 'url-loader' )
      .options( {
        limit: 10000,
        fallback: {
          loader: 'file-loader',
          options: {
            name: 'img/[path][name].[hash].[ext]'
          }
        }
      } )
  },
  css: {
    loaderOptions: {
      // css: {
      //   // 这里的选项会传递给 css-loader
      // },
      postcss: {
        // 这里的选项会传递给 postcss-loader
        plugins: [
          require( 'postcss-px2rem' )( { remUnit: 75 } )
        ]
      },
    }
  }
}