module.exports = {
  entry: "./src/assets/index.js",
  output: {
    path: __dirname + '/build/assets/',
    publicPath: "/",
    filename: "bundle.js"
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: "babel" }
    ]
  },
  plugins: []
};
