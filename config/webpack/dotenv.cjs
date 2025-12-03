const Dotenv = require('dotenv-webpack');
const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = new Dotenv({
      path: isDevelopment ? './.env.development' : './.env.production',
      safe: false,
      systemvars: true,
      defaults: false,
    })