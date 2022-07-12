const path = require('path')
const webpack = require('webpack')
const dotenv = require('dotenv')

const CURRENT_WORKING_DIR = process.cwd()

const env = dotenv.config().parsed

const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {})

const config = {
    name: "browser",
    mode: "development",
    devtool: 'eval-source-map',
    entry: [
        'webpack-hot-middleware/client?reload=true',
        path.join(CURRENT_WORKING_DIR, 'client/src/index.js')
    ],
    output: {
        path: path.join(CURRENT_WORKING_DIR , '/dist'),
        filename: 'bundle.js',
        publicPath: '/dist/'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                ]
            },
            {
                test: /\.(ttf|eot|svg|gif|jpg|png)(\?[\s\S]+)?$/,
                use: 'file-loader'
            }
        ]
    },  
    plugins: [
          new webpack.HotModuleReplacementPlugin(),
          new webpack.NoEmitOnErrorsPlugin(),
          new webpack.DefinePlugin(envKeys),
    ],
    resolve: {
        alias: {
          'react-dom': '@hot-loader/react-dom'
        }
    },
}

module.exports = config