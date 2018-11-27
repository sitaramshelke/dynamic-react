var path = require("path");
var webpack = require("webpack");
module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.js",
    upload: "./src/upload.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]-bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        }
      },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      ReactTable: "react-table"
    })
  ]
};
