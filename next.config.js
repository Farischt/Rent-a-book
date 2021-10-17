const withImages = require("next-images")

module.exports = withImages({
  module: {
    rules: [
      {
        test: /\.(svg)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
})
