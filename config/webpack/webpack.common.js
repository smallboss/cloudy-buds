const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "ts-loader",
        options: { configFile: path.resolve("config/tsconfig.json") },
      },
    ],
  },
  resolve: {
    alias: {
      three: path.resolve("./node_modules/three"),
    },
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "../../dist"),
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "./src/index.html",
          to: "./",
        },
        {
          from: "./src/assets/models",
          to: "./assets/models/",
        },
      ],
    }),
  ],
};
