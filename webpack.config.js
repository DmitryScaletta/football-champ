const path         = require('path')
const webpack      = require('webpack')

const isProduction = process.env.NODE_ENV === 'production'
let   plugins      = []
let   entry        = []

plugins.push(new webpack.NoErrorsPlugin())
plugins.push(new webpack.DefinePlugin({
	'process.env': {
		NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
	}
}))

if (isProduction) {
	// Search for equal or similar files and deduplicate them in the output
	plugins.push(new webpack.optimize.DedupePlugin())
	// Assign the module and chunk ids by occurrence count.
	plugins.push(new webpack.optimize.OccurenceOrderPlugin())
	// Minimize all JavaScript output of chunks
	plugins.push(new webpack.optimize.UglifyJsPlugin({
		compress: {
			warnings: false
		}
	}))
} else {
	plugins.push(new webpack.HotModuleReplacementPlugin())

	entry.push('react-hot-loader/patch')
	entry.push('webpack-hot-middleware/client')
}

// entry.push('babel-polyfill')
entry.push('./client/index.js')


module.exports = {
	devtool: null, // isProduction ? null : 'source-map',
	entry,
	plugins,
	output: {
		path:       path.join(__dirname, 'server', 'static'),
		filename:   'bundle.js'
	},
	module: {
		loaders: [
			{	test:    /\.jsx?$/,  
				loader:  'babel', 
				include: path.join(__dirname, 'client') },
		]
	}
}