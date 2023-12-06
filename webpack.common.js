const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer")
const { DuplicatesPlugin } = require("inspectpack/plugin")
const { join } = require("path")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const isDemo = !!process.env.isDemo
const withReport = !!process.env.withReport
const analyzeDeps = !!process.env.analyzeDeps

module.exports = {
    entry: join(__dirname, "client/src/index"),
    output: {
        path: join(__dirname, "static"),
        clean: true
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: "client/index.html",
            inject: true,
            minify: true
        })
    ].concat(withReport ? [new BundleAnalyzerPlugin()] : [])
        .concat(analyzeDeps ? [new DuplicatesPlugin({ emitErrors: true, verbose: true })] : []),
    module: {
        rules: [
            {
                test: /\.(ts|js|mjs|cjs)x?$/i,
                use: [
                    "babel-loader",
                    {
                        loader: "webpack-preprocessor-loader",
                        options: { params: { demo: isDemo } }
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "sass-loader",
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                            modules: true
                        }
                    }
                ],
            },
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                            modules: true
                        }
                    },
                ],
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                type: "asset",
            }
        ],
    },
    resolve: {
        extensions: [".*", ".tsx", ".ts", ".mts", ".jsx", ".js", ".mjs"],
        fallback: {
            "stream": require.resolve("stream-browserify"),
            "crypto": require.resolve("crypto-browserify"),
            "path": require.resolve("path-browserify"),
            "buffer": require.resolve("buffer/"),
            "util": require.resolve("util/"),
            "fs": false
        },
        alias: {
            "bn.js": require.resolve("bn.js"),
            "isarray": require.resolve("isarray"),
            "level-fix-range": require.resolve("level-fix-range"),
            "object-keys": require.resolve("object-keys"),
            "prr": require.resolve("prr"),
            "react-is": require.resolve("react-is"),
            "safe-buffer": require.resolve("safe-buffer"),
            "string_decoder": require.resolve("string_decoder"),
            "xtend": require.resolve("xtend"),
            "framer-motion": require.resolve("framer-motion")
        }
    }
}