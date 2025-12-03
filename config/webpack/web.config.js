import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import webpack from 'webpack';

const require = createRequire(import.meta.url);
const rules = require('./rules.cjs');
const dotenvPlugin = require('./dotenv.cjs');
const aliases = require('./aliases.cjs');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDevelopment = process.env.NODE_ENV !== 'production';

export default {
  mode: isDevelopment ? 'development' : 'production',
  entry: './src/renderer/index.tsx',
  target: 'web',
  module: { rules },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: aliases,
  },
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: 'bundle.js',
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/renderer/public/index.html',
      inject: 'body',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    dotenvPlugin,
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, '../../dist'),
    },
    compress: true,
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,
  },
};