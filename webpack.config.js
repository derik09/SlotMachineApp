const path = require('path');

module.exports = {
    entry: {
        app: './src/SlotMachine.js'
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'app.bundle.js'
    },
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['env'],
                plugins: ['transform-class-properties']
            }
        }]
    }
}