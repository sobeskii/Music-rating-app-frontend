const Dotenv = require('dotenv-webpack');

module.exports = {
    devServer: {
        host: "127.0.0.1",
        port: "8080"
    },
    configureWebpack: {
        plugins: [
            new Dotenv()
        ]
    }
}