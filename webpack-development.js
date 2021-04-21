const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack-common");

const configuration = merge(common, {
  mode: "production",
});

module.exports = configuration;
