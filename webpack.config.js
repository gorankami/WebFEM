module.exports = {
  entry : __dirname + '/src/index.js',
  watch : false,
  output: {
    path    : __dirname + '/dist',
    filename: 'index.js'
  },
  module: {
    loaders: [{
      test  : /\.html$/,
      loader: "html-loader?attrs=false"
    }, {
      test: /\.css$/, loader: "style-loader!css-loader"
    }, {
      test: /\.js$/, loader: "babel-loader"
    }]
  }
};