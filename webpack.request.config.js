var path = require("path");
module.exports = {
  mode: "development",
  entry: {
    index: "/index.js",
  },
  output: {
    path: "/",
    filename: "user-bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }]
      }
    ]
  }
};
