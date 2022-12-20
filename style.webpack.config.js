const webpack = require('webpack');
const path = require('path');
const { WebpackSweetEntry } = require('@sect/webpack-sweet-entry'); // Generate multy path for entry
const FileManagerPlugin = require('filemanager-webpack-plugin'); // remove, move, copy, delete, archive files
const StylelintPlugin = require('stylelint-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const sourcePath = path.join(__dirname, 'src');
const buildPath = path.join(__dirname, 'dist');

module.exports = {
    entry: WebpackSweetEntry(path.resolve(sourcePath, 'sass/**/*.scss'), 'scss', 'sass'),
    output: {
      filename: '[name].bundle.js',
      path: path.join(buildPath, 'css'),
    },
  
    resolve: {
      extensions: ['.css', '.scss'],
      alias: {
        // Provides ability to include node_modules with ~
        '~': path.resolve(process.cwd(), 'src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            { loader: "css-loader", options: { url: false, importLoaders: 1 } },
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [
                    autoprefixer(),
                    cssnano()
                  ]
                },
              },
            },
            { loader: 'sass-loader' },
          ],
        },
      ],
  
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      new StylelintPlugin({
        fix: true,
        failOnError: false // Todo
      }),
      new FileManagerPlugin({
        events: {
          onEnd: {
            // Delete all js files in dist/css folder
            delete: [path.resolve(buildPath, 'css/**/*.js')]
          },
        },
      })
    ]
  }
