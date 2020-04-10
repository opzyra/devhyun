const path = require('path');
const { NODE_ENV } = process.env;

module.exports = {
  entry: './src/script/index.js',
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: 'module.js',
  },
  devtool: NODE_ENV === 'development' ? 'inline-source-map' : false,
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
