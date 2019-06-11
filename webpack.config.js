const webpack = require('webpack');
const path = require('path');
const ClosureWebpackPlugin = require('closure-webpack-plugin');

const pjson = require('./package.json');

module.exports = (env) => {
  const isProduction = (env && env.production);
  return {
    mode: env,
    target: 'node',
    devtool: !isProduction ? 'source-map' : false,
    devServer: {
      contentBase: 'docs',
      open: false,
    },
    entry: {
      'smf.player': './src/player.js',
      'smf.parser': './src/smf.js',
    },
    output: {
      path: path.resolve(__dirname, 'bin'),
      filename: !isProduction ? '[name].js' : '[name].min.js',
      library: 'SMF',
      libraryTarget: 'umd',
      umdNamedDefine: true,
      globalObject: `(typeof self !== 'undefined' ? self : this)`,
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new ClosureWebpackPlugin(
          {
            mode: 'STANDARD',
            platform: 'java',
          },
          {
            compilation_level: 'SIMPLE_OPTIMIZATIONS',
            language_in: 'ECMASCRIPT6',
            language_out: 'ECMASCRIPT_2017',
            renaming: true,
          }),
      ],
      splitChunks: {
        minSize: 0,
      },
      concatenateModules: false,
    },
    plugins: [
      new webpack.BannerPlugin({
        banner: `${pjson.name} v${pjson.version} | ${pjson.author} / ${pjson.contributors} | license: ${pjson.license}`,
      }),
    ],
  };
};
