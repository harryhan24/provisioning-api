const nodeExternals = require("webpack-node-externals");
const slsw = require("serverless-webpack");

module.exports = {
  entry: slsw.lib.entries,
  target: "node",
  externals: [
    nodeExternals(),
    {
      sequelize: "require('sequelize')",
    },
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ["babel-loader"],
        include: __dirname,
        exclude: /node_modules/,
      },
    ],
  },
};
