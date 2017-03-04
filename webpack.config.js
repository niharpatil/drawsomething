var path = require('path');

module.exports = {
	entry: './app.js',

	output: {
		path: path.join(__dirname,'public'),
		filename: 'bundle.js'
	},

	module: {
		rules: [
			{
				test: /\.handlebars$/,
				loader: 'handlebars-loader'
			}
		]
	}
}