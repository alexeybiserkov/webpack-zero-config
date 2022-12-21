const webpack = require('webpack');
const path = require('path');
const { WebpackSweetEntry } = require('@sect/webpack-sweet-entry'); // Generate multy path for entry
const FileManagerPlugin = require('filemanager-webpack-plugin'); // remove, move, copy, delete, archive files

const sourcePath = path.join(__dirname, 'src');
const buildPath = path.join(__dirname, 'dist');

module.exports = {
  entry: WebpackSweetEntry(path.resolve(sourcePath, 'img/svg/**/*.svg'), 'svg', 'svg'),
  output: {
    filename: '[name].bundle.js',
    path: path.join(buildPath, 'img/svg'),
  },
  module: {
    rules: [
      {
        test: /\.(svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: (srcPath) => {
                const param = srcPath.split('/').reverse();
                const dPath = param.slice(1, ( param.indexOf('img') -1) ).reverse().join('/')
                return dPath + '/[name].[ext]';
              }
            },
          },
          {
            loader: 'svgo-loader',
            options: {
              multipass: true,
              js2svg: {
                indent: 2,
                pretty: false,
              },
              plugins: [
                // set of built-in plugins enabled by default
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      // customize default plugin options
                      inlineStyles: {
                        onlyMatchedOnce: false,
                      },
            
                      // or disable plugins
                      removeDoctype: false,
                      removeViewBox: false,
                    },
                  },
                },
            
                // enable built-in plugins by name
                'prefixIds',
            
                // or by expanded notation which allows to configure plugin
                {
                  name: 'sortAttrs',
                  params: {
                    xmlnsOrder: 'alphabetical',
                  },
                },
              ],
            }
          }
        ],
      }
    ]
  },
  plugins: [
    new FileManagerPlugin({
      events: {
        onEnd: {
          // Delete all js files in dist/img folder
          delete: [path.resolve(buildPath, 'img/**/*.js')],
          copy: [
            // Copy Fonts to dist folder
            { source: path.resolve(sourcePath, 'fonts'), destination: path.resolve(buildPath, 'fonts') },
            // Copy Images to dist folder
            { source: path.resolve(sourcePath, 'img/**/*.{png,jpg,jpeg,webp}'), destination: path.resolve(buildPath, 'img') },
          ],
        },
      },
    })
  ]
};
