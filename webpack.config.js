const path = require('path');

const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    entry: './src/app.ts',
    module: {
        rules : [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                include: /src/
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development'
                        }
                    },
                    { loader: 'css-loader' },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [autoprefixer()]
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            includePaths: ['./node_modules']
                        }
                    }
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/[name].[ext]'
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'build/public'),
        historyApiFallback: true,
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:3001/'
            }
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public/index.html')
        }),
        new CopyWebpackPlugin([
            {
                from: 'public',
                ignore: ['*.html']
            }
        ]),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        })
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'build/public')
    }
}
