const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    lib: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: '[name].js',
    library: 'StuckJs',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  browsers: [
                    'last 1 version',
                    '> 5%',
                  ],
                },
                modules: false,
              }],
            ],
            plugins: [
              'transform-class',
              'transform-class-properties',
              ['@babel/plugin-transform-runtime', {
                polyfill: false,
                regenerator: true,
              }],
              '@babel/plugin-syntax-flow',
              '@babel/plugin-proposal-object-rest-spread',
              'transform-flow-strip-types',
            ],
          },
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
        },
      },
    ],
  },
};
