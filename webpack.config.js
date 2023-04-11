const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/index.ts',
    mode: 'production',
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            core: path.resolve(__dirname, 'src', 'core'),
            database: path.resolve(__dirname, 'src', 'database'),
            middlewares: path.resolve(__dirname, 'src', 'middlewares'),
            modules: path.resolve(__dirname, 'src', 'modules'),
            network: path.resolve(__dirname, 'src', 'network'),
            swagger: path.resolve(__dirname, 'src', 'swagger'),
            utils: path.resolve(__dirname, 'src', 'utils'),
        },
    },
    plugins: [
        new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ }),
        new webpack.IgnorePlugin({ resourceRegExp: /^pg-hstore$/ }),
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ['ts-loader'],
            },
        ],
    },
};