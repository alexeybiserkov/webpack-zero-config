const webpack = require('webpack');
const path = require('path');
const { WebpackSweetEntry } = require('@sect/webpack-sweet-entry'); // Generate multy path for entry
const ESLintPlugin = require('eslint-webpack-plugin');

const sourcePath = path.join(__dirname, 'src');
const buildPath = path.join(__dirname, 'dist');

module.exports = {
    entry: {
      ...WebpackSweetEntry(path.resolve(sourcePath, 'js/*.js*'), 'js', 'js'),
      ...WebpackSweetEntry(path.resolve(sourcePath, 'js/shortcodes/*.js*'), 'js', 'js'),
      ...WebpackSweetEntry(path.resolve(sourcePath, 'js/taco-elements/*.js*'), 'js', 'js'),
    },
    output: {
      path: path.resolve(buildPath, 'js'),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    },
    plugins: [new ESLintPlugin({
      fix: true,
      failOnError: false, // Todo
    })],
  }