const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
    entry: './src/api.js',
    output: {
        path: path.resolve(__dirname, ''),
        filename: 'index.js',
        libraryTarget: "commonjs2" 
    },
    target: 'node',
    externals: [nodeExternals()],
    mode: 'development',
    watch: true,
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                loader: "eslint-loader"
            }
        ]
    }
}