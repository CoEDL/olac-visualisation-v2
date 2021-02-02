const path = require("path");
module.exports = {
    configureWebpack: {
        devServer: {
            contentBase: path.join(__dirname, "dist", "repository"),
            writeToDisk: true,
            serveIndex: true,
        },
    },
};
