const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/olacvis/" : "/",
  configureWebpack: {
    plugins: [
      new CopyPlugin({
        patterns: [{ from: "data", to: "repository" }],
      }),
    ],
  },
};
