const path = require('path');
const rules = require('./rules.cjs');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');
const dotenvPlugin = require('./dotenv.cjs');


module.exports = {
  entry: './src/main/index.ts',
  target: 'electron-main',
  module: { rules },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(process.cwd(), '.webpack/main'),
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    dotenvPlugin,
  ],
};
