const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack-common");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const configuration = merge(common, {
  mode: "development",
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
});

module.exports = configuration;
