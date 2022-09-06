const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const config = {
  entry: './src/index.ts',
  devtool: 'source-map',
  devServer: {
    // https: true,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    proxy: {
      '/socket.io': {
        // target: 'https://t3d.22k.space',
        target: 'http://localhost:3001',
        changeOrigin: true,
        ws: true
      },
      '/api': {
        // target: 'https://t3d.22k.space',
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    },
    compress: true,
    port: 3000,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },

  externals: {
    bufferutil: "bufferutil",
    "utf-8-validate": "utf-8-validate",
  },
  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        include: /game/,
        use: ['@svgr/webpack', 'url-loader'],
      },
    ]
  },
  resolve: {
    alias: {
      cannon: path.resolve(__dirname, './src/lib/cannon/cannon.js')
    },
    extensions: ['.tsx', '.ts', '.js'],
    fallback: { "url": require.resolve("url/") }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: "./index.html"
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets' }
      ],
    }),
  ]
};

module.exports = config;
