var path = require("path");

module.exports = {
  entry: "./src/assets/index",
  output: {
    path: path.join(__dirname, 'build', 'assets'),
    publicPath: "/",
    filename: "bundle.js",
    chunkFilename: "[chunkhash].js"
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: "babel" }
    ]
  },
  plugins: []
};
