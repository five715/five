const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require('path');


module.exports = {
    entry: {
        "app": './src/index.js'
    },
    output: {
        filename: './js/[name].bundle.js',
        chunkFilename: './js/[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        contentBase: './dist',
        hot: true
    },
    plugins: [
        new CleanWebpackPlugin('dist'),
        new HtmlWebpackPlugin({
            title: "running",
            template: './src/index.html',
            minify: { html5: true }
        }),
        new ExtractTextPlugin("./css/styles.css"),
        new webpack.ProvidePlugin({
            THREE: "three",
            createjs: "latest-createjs"
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.(less|css)$/i,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'less-loader'],
                    publicPath: '../'
                })
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            regExp: /(\w+)[\/|\\](\w+)\.(png|jpg|gif)/i,
                            name(file) {
                                return '[path][name].[ext]'
                            }
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 65
                            },
                            optipng: {
                                enabled: false
                            },
                            pngquant: {
                                quality: '65-90',
                                speed: 4
                            },
                            gifsicle: {
                                interlaced: false
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(wav|mp3)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'sounds/[name].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(fbx)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'models/[name].[ext]'
                        }
                    }
                ]
            }
        ]
    }
}