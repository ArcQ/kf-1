const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  resolve: {
    alias: {
      utils: path.resolve(__dirname, 'src/utils/'),
      "game/engine": path.resolve(__dirname, 'src/'),
      "assets": path.resolve(__dirname, '../../assets')
    }
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
  output: {
    filename: 'gameEngine.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'gameEngine',
    libraryTarget: 'commonjs2',
  }
};
