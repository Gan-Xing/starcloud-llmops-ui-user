const webpack = require('webpack');
const WorkBoxPlugin = require('workbox-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

module.exports = function override(config) {
    config.resolve.fallback = {
        process: require.resolve('process/browser'),
        stream: require.resolve('stream-browserify'),
        crypto: require.resolve('crypto-browserify'),
        util: require.resolve('util'),
        buffer: require.resolve('buffer'),
        path: require.resolve('path-browserify'), // 添加这行
        os: require.resolve('os-browserify/browser') // 添加这行
    };

    // https://stackoverflow.com/questions/69135310/workaround-for-cache-size-limit-in-create-react-app-pwa-service-worker
    config.plugins.forEach((plugin) => {
        if (plugin instanceof WorkBoxPlugin.InjectManifest) {
            plugin.config.maximumFileSizeToCacheInBytes = 50 * 1024 * 1024;
        }
    });

    config.plugins = [
        ...config.plugins,
        new CompressionWebpackPlugin({
            algorithm: 'gzip',
            test: /\.(js|css)$/, // 压缩 JavaScript 和 CSS 文件
            threshold: 10240, // 仅压缩大于 10KB 的文件
            minRatio: 0.8 // 仅压缩压缩率大于 0.8 的文件
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser.js',
            Buffer: ['buffer', 'Buffer']
        })
    ];

    // config.optimization = {
    //     usedExports: true,
    //     splitChunks: {
    //         chunks: 'all',
    //         minSize: 30000,
    //         maxSize: 100000, // 根据需要设置最大大小
    //         minChunks: 1,
    //         maxAsyncRequests: 5,
    //         maxInitialRequests: 3,
    //         automaticNameDelimiter: '~',
    //         name: 'mofa',
    //         cacheGroups: {
    //             vendors: {
    //                 test: /[\\/]node_modules[\\/]/,
    //                 priority: -10
    //             },
    //             default: {
    //                 minChunks: 2, // 根据需要调整引用次数
    //                 priority: -20,
    //                 reuseExistingChunk: true
    //             }
    //         }
    //     }
    // };

    return config;
};
