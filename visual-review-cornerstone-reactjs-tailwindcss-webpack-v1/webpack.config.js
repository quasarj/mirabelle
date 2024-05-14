const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',  // Set to 'production' or 'development' as needed
  // entry: './src/viewer.js',
  devtool: 'inline-source-map',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/', // Ensures that all output files are served from /dist/
    clean: true,
    filename: 'bundle.js'
  },
  experiments: {
      asyncWebAssembly: true,
      // syncWebAssembly: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      /* { 
        test: /\.wasm/,
        type: 'asset/resource'
      }, */
    ]
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    headers: {
            "Cross-Origin-Opener-Policy": "same-origin",
            "Cross-Origin-Embedder-Policy": "require-corp",
        },
    proxy: [
            {
                context: ['/papi'],
                target: 'http://tcia-posda-rh-1.ad.uams.edu',
                headers: { 'Authorization': 'Bearer e9a63bc2-bfa5-4299-afb3-c844fb2ef38b' },
            },
        ],
    // historyApiFallback: true, // This helps with routing; ensure it's true if using React Router
    // compress: true,
    port: 3000,
  },
  /* plugins: [
      new HtmlWebpackPlugin({
          template: 'src/index.html'
      })
  ] */
};