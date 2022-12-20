const webpack = require('webpack');
const path = require('path');
const { WebpackSweetEntry } = require('@sect/webpack-sweet-entry'); // Generate multy path for entry
const FileManagerPlugin = require('filemanager-webpack-plugin'); // remove, move, copy, delete, archive files
var SvgChunkWebpackPlugin = require('svg-chunk-webpack-plugin');

const sourcePath = path.join(__dirname, 'src');
const buildPath = path.join(__dirname, 'dist');

module.exports =  {
    entry: WebpackSweetEntry(path.resolve(sourcePath, 'img/svg/**/*.svg'), 'svg', 'svg'),
    output: {
      filename: '[name].bundle.js',
      path: path.join(buildPath, 'img/svg'),
    },
    module: {
      rules: [
        {
          test: /\.svg$/,
          use: [
            {
              loader: SvgChunkWebpackPlugin.loader
            }
          ]
        }
      ]
    },
    plugins: [
      new SvgChunkWebpackPlugin({
        filename: '[name].svg'
      }),
      new FileManagerPlugin({
        events: {
          onEnd: {
            // Delete all js files in dist/img folder
            delete: [path.resolve(buildPath, 'img/**/*.js')],
            copy: [
              // Copy Fonts to dist folder
              { source: path.resolve(sourcePath, 'fonts'), destination: path.resolve(buildPath, 'fonts') },
              // Copy Images to dist folder
              { source: path.resolve(sourcePath, 'img/**/*.png'), destination: path.resolve(buildPath, 'img') },
            ],
          },
        },
      })
    ]
};
  