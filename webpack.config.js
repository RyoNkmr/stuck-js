const path = require('path');
const FlowBabelWebpackPlugin = require('flow-babel-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

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
        test: /\.[tj]s$/,
        exclude: /node_modules|\.cache/,
        use: [
          {
            loader: 'ts-loader',
          },
          {
            loader: 'eslint-loader',
            options: {
              fix: true,
              cache: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [new FlowBabelWebpackPlugin(), new CompressionPlugin()],
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

module.exports = [docBuild, prodBuild];
