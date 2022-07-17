const path = require('path');
const webpack = require("webpack");
module.exports = {
    entry: "./index.js",
    devtool: "source-map",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "fidaa.min.js"
    },
    mode: "production",
    // plugins: [
    //   new webpack.optimize.UglifyJsPlugin({
    //    minimize: true,
    //    compress: false
    //   })
    // ]
  };