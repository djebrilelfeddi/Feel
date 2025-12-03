const Dotenv = require('dotenv-webpack');
const path = require('path');
const rules = require('./rules.cjs');
const webpack = require('webpack');
const aliases = require('./aliases.cjs');
const dotenvPlugin = require('./dotenv.cjs');

module.exports = {
  module: { rules },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: aliases,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    dotenvPlugin,
  ],
};
