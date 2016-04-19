const webpack = require('webpack');

module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    files: [
      'tests.webpack.js',
      {
        pattern: 'src/**/__tests__/*.js',
        included: false,
        served: false,
        watched: true
      }
    ],
    frameworks: ['jasmine'],
    preprocessors: {
      'tests.webpack.js': ['webpack', 'sourcemap', 'coverage'],
    },
    reporters: ['progress', 'notification'],
    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' }
        ]
      },
      plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('Test')
            }
        })
      ],
      watch: true
    },
    webpackServer: {
      noInfo: true,
    }
  });
};