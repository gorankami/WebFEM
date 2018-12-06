module.exports = {
  entry: './src/index.js',
  module: {
    rules: [{
      test: /\.(html|glsl)$/,
      use: "raw-loader"
    }]
  },
  output: {
    filename: 'app.js',
    path: __dirname + '/build'
  }
}