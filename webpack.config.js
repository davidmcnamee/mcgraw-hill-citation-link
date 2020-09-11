const path = require("path");

module.exports = (env) => ({
  mode: env.NODE_ENV,
  devtool: "inline-source-map",

  entry: {
    content: "./src/app/content.ts",
  },

  output: {
    path: path.resolve(__dirname, "dist/js"),
    filename: "[name].js",
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },

  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
    ],
  },
});
