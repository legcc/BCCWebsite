module.exports = {
    /*
     ** Headers of the page
     */
    render: {
        resourceHints: false
    },
    cache: true,
    head: {
        title: 'BCC Mandarin - Just Enjoy Mandarin',
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', content: "BCC Web"}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: 'https://static.bccmandarin.com/base/favicon.svg'}
        ]
    },
    /*
     ** Customize the progress-bar color
     */
    loading: {
        color: 'rgb(102,153,212)',
        failedColor: 'red',
    },
//全局css
    css: [
        '~/static/reset/reset.css',
    ],
    plugins: [
        '~/plugins/common.js',
        '~/plugins/element-ui.js',
    ],

    build: {
        //此处覆盖默认的loaders也可以定义新的loader
        // publicPath: 'https://static.bccmandarin.com/images',
        ssr: true,
        cssSourceMap:false,
        //publicPath: 'https://cdn.nuxtjs.org/',
        publicPath: '/',
        babel: {
            "plugins": [
                "transform-decorators-legacy",
                "transform-class-properties"
            ]
        },
        loaders: [
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                loader: 'url-loader',
                query: {
                    limit: 10000, // 10KO
                    name: 'img/[name].[hash].[ext]'
                }

            }, {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 2000,
                    name: 'fonts/[name].[ext]'
                }
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader!less-loader!postcss-loader"
            },
            {
                test: /\.scss$/,
                loader: "style-loader!css-loader!sass-loader!postcss-loader"
            }
        ],
        postcss: [
            require('autoprefixer')({
                browsers: ['last 3 versions', "ie 9"]
            }),
            require('postcss-px2rem')({remUnit: 100}),
            require('postcss-aspect-ratio-mini')
        ],
        vendor: [
            'echarts',
            'element-ui',
            'move-js',
            'ramda',
            'vuedraggable',
            'viscroll',
            'vue-class-component',
            '~/plugins/utils.js'],

    },
    router: {
        // 在每页渲染前运行 middleware 中间件的逻辑
        middleware: 'filter'
    }
//关闭预加载
// node_modules/nuxt/dist/nuxt.js中改
// resourceHints = context.renderResourceHints();
//     resourceHints = "";
}
