const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const examplePath = path.join(__dirname, '/examples');

module.exports = {
  context: path.join(__dirname, '/src'),
  entry: {
    javascript: path.join(examplePath, 'jsx/example.js'),
    html: path.join(examplePath, '/index.html')
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
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css!sass?includePaths[]='+path.resolve(__dirname, "./node_modules/compass-mixins/lib")),
        exclude: /node_modules/
      }
    ],
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'underscore': '_'
  },
  devtool: 'eval',
  output: {
    libraryTarget: "var",
    library: "ProperSearch",
    filename: "example.js",
    path: path.join(__dirname, "/dist")
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