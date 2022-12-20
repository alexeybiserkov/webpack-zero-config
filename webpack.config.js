const webpack = require('webpack');
const path = require('path');

// Helpers
const { WebpackSweetEntry } = require('@sect/webpack-sweet-entry'); // Generate multy path for entry
const FileManagerPlugin = require('filemanager-webpack-plugin'); // remove, move, copy, delete, archive files

// JS 
const ESLintPlugin = require('eslint-webpack-plugin');

// Css 
const StylelintPlugin = require('stylelint-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

// Svg
var SvgChunkWebpackPlugin = require('svg-chunk-webpack-plugin');

const sourcePath = path.join(__dirname, 'src');
const buildPath = path.join(__dirname, 'dist');

// Modules

const jsBuildModule = {
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

const mediaAssetsBuildModule = {
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
          delete: [path.resolve(buildPath, 'css/**/*.js')],
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
}

const svgModule = {
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
        },
      },
    })
  ]
};

module.exports = [
  //jsBuildModule,
  mediaAssetsBuildModule,
  // svgModule
]
