const path = require('path');
const CompressionPlugin = require("compression-webpack-plugin");

const prodBuild = {
  mode: 'production',
  entry: {
    index: './src/index.js',
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
  plugins: [
    new CompressionPlugin(),
  ],
};

const docBuild = {
  ...prodBuild,
  mode: 'development',
  output: {
    ...prodBuild.output,
    path: path.resolve(__dirname, 'docs'),
  },
  devtool: 'inline-source-map',
  plugins: [],
};

module.exports = [
  docBuild,
  prodBuild,
];
