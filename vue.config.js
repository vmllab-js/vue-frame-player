const path = require( 'path' );

function resolve( dir ) {
	return path.join( __dirname, dir )
}

module.exports = {
	// 修改 src 为 examples
	pages: {
		index: {
			entry: 'examples/main.ts',
			template: 'public/index.html',
			filename: 'index.html'
		}
	},
	// 扩展 webpack 配置，使 packages 加入编译
	chainWebpack: config => {
		config.module
			.rule( 'js' )
			.include
			.add( '/packages' )
			.end()
			.use( 'babel' )
			.loader( 'babel-loader' )
			.tap( options => {
				// 修改它的选项...
				return options
			} )
		config.resolve.alias
			.set( '@$', resolve( 'examples' ) )
	}
}