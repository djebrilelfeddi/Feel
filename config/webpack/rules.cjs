module.exports = [
  {
    test: /\.[jt]sx?$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          ['@babel/preset-env', { targets: { browsers: 'last 3 versions' }, bugfixes: true }],
          '@babel/preset-react',
          '@babel/preset-typescript',
        ],
      },
    },
  },
  {
    test: /\.css$/,
    use: [
      'style-loader', 
      'css-loader', 
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            config: './config/postcss.config.js',
          },
        },
      }
    ],
  },
];