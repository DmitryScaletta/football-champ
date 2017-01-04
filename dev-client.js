var path          = require('path')
var webpack       = require('webpack')
var express       = require('express')
var devMiddleware = require('webpack-dev-middleware')
var hotMiddleware = require('webpack-hot-middleware')
var proxy         = require('http-proxy-middleware')
var config        = require('./webpack.config')

var app           = express()
var compiler      = webpack(config)


app.use(devMiddleware(compiler, {
	publicPath: config.output.publicPath,
	historyApiFallback: true,
	stats: {
		colors: true,
		chunks: false
	}
	/*proxy: {
		'*': {
			target: 'http://localhost:3000',
			secure: false, 
			changeOrigin: true
		}
	}*/
}))

app.use(hotMiddleware(compiler))

app.use('/api', proxy({ target: 'http://localhost:3000' }))

app.use(express.static(path.join(__dirname, './server/static')))

app.listen(3001, function (err) {
	if (err) return console.error(err)
	console.log('Listening at http://localhost:3001/')
})
