const path = require("path");

module.exports = {
  entry: "./src/script/index.js",
  output: {
    path: path.resolve(__dirname, "public/js"),
    filename: "module.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
};
