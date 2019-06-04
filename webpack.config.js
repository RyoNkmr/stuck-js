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
  module: {
    rules: [
      {
        test: /\.[tj]s$/,
        exclude: /node_modules|\.cache/,
        use: ['ts-loader', 'eslint-loader'],
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
  module: {
    rules: [
      {
        test: /\.[tj]s$/,
        exclude: /node_modules|\.cache/,
        use: [
          'ts-loader',
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
};

module.exports = [docBuild, prodBuild];
