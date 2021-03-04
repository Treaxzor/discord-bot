const path = require("path");
const fs = require('fs')

module.exports = {
  publicPath: "/",
  outputDir: "public",
  indexPath: "app.html",
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
  },
  transpileDependencies: [

  ],
  chainWebpack: (config) => {
    config
      .entry("app")
      .clear()
      .add("./web/main.js")
      .end();
    config.resolve.alias.set("@", path.join(__dirname, "web"));

    var htmlPlugin = config.plugin("html");
    if (htmlPlugin && htmlPlugin.tap) {
      htmlPlugin.tap((args) => {
        if (args.length > 0) {
          args[0].template = path.join(__dirname, "web/public/app.html");
        }
        return args;
      });
    }

    var copyPlugin = config.plugin("copy");
    if (copyPlugin && copyPlugin.tap) {
      copyPlugin.tap((args) => {
        if (args.length > 0 && args[0].length > 0) {
          args[0][0].from = path.join(__dirname, "web/public");
        }
        return args;
      });
    }
  },
};
