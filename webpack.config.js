var path = require('path')

module.exports = {
    mode: 'production',
    entry: './src/index',
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: 'webpack.bundle.js'
    },
    devtool: 'source-map',

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },

    module: {
        rules: [{
            // Include ts, tsx, js, and jsx files.
            test: /\.(ts|js)x?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }],
    },
    devServer: {
        contentBase: "./dist", //static server根目录
    }
}