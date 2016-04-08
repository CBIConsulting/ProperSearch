const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: {
    javascript: "./jsx/propersearch.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ["babel-loader"],
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loaders: ["babel-loader"],
      },
      {
        test: /\.html$/,
        loader: "file?name=[name].[ext]",
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css!sass?includePaths[]='+path.resolve(__dirname, "./node_modules/compass-mixins/lib"))
      }
    ],
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'underscore': '_'
  },
  output: {
    libraryTarget: "var",
    library: "ProperSearch",
    filename: "propersearch.js",
    path: __dirname + "/dist"
  },
  plugins: [
    new ExtractTextPlugin('propersearch.css', {
      allChunks: true
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production'),
            APP_ENV: JSON.stringify('browser')
        },
    })
  ]
}