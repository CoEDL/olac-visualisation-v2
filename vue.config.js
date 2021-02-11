const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/olacvis/" : "/",
  configureWebpack: {
    devServer: {
      headers: { "Access-Control-Allow-Origin": "*" },
    },
    plugins: [
      new CopyPlugin({
        patterns: [{ from: "data", to: "repository" }],
      }),
    ],
  },
};
