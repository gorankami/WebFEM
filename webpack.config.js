const path = require("path");

module.exports = {
  resolve: {
    modules: [
      path.join(__dirname, "src"),
      "node_modules"
    ]
  },
  entry  : __dirname + '/src/index.js',
  // watch : true,
  output : {
    path    : path.resolve(__dirname + '/dist'),
    filename: 'index.js'
  },
  module : {
    rules: [{
      test: /\.(html|glsl)$/,
      use : "raw-loader"
    }, {
      test: /\.css$/,
      use : ["style-loader", "css-loader"]
    }, {
      test: /\.js$/,
      use : "babel-loader"
    }]
  }
};