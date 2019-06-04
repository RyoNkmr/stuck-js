const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');

const prodBuild = {
  mode: 'production',
  entry: {
    index: './src/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: '[name].js',
    library: 'StuckJs',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.[tj]s$/,
        exclude: /node_modules|\.cache/,
        use: ['ts-loader'],
      },
    ],
  },
  plugins: [new CompressionPlugin()],
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

module.exports = [prodBuild, docBuild];
