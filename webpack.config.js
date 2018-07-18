const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (a, args)=>{
  const config = {
    module : {
      rules: [{
        test: /\.(html|glsl)$/,
        use : "raw-loader"
      }, {
        test: /\.css$/,
        use : ["style-loader", "css-loader"]
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        use:{
          loader: "babel-loader"
        }
      }]
    },
    plugins: [
      new HtmlWebpackPlugin({
          template: "./src/index.html",
          filename: "./index.html"
      }),
      new webpack.optimize.ModuleConcatenationPlugin()
    ]
  }
  return config;
};