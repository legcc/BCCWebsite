import {Nuxt, Builder} from 'nuxt'
import express from 'express'
import router from './api/index.js';
const bodyParser = require('body-parser')
const session = require('express-session')
const host = require("../static/server.config").host
const port = require("../static/server.config").port
const backEndPath = require("../static/server.config").backEndPath
const mockPath = require("../static/server.config").mockPath
const app = express()
const request = require('request')

app.set('port', port)
// Import API Routes
// Body parser，用来封装 req.body
app.use(bodyParser.json())
// Sessions 来创建 req.session
app.use(session({
    secret: 'super-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 3*60*60*1000}
}))
app.use(router);

// Start nuxt.js
async function start() {
    // Add nuxt.js middleware
    app.use('/', (req, res, next) => {
        // if (/^\/proxy/.test(req.url)&&req.session.authUser) {
        //     const url = backEndPath + req.url.replace(/\/proxy/, "")
        //     req.pipe(request(url)).pipe(res.set('Access-Control-Allow-Origin', '*'))
        // } 接口加密
        if (/^\/proxy/.test(req.url)) {
            const url = backEndPath + req.url.replace(/\/proxy/, "")
            req.pipe(request(url)).pipe(res.set('Access-Control-Allow-Origin', '*'))
        // } else if (/^\/virtualInterface/.test(req.url)) {
        //     console.log("2-------VirtualInterface");
        //     const url = mockPath + req.url.replace(/\/virtualInterface/, "")
        //     req.pipe(request(url)).pipe(res.set('Access-Control-Allow-Origin', '*'))
        } else {
            next();
        }
    });

    let config = require('../nuxt.config.js')
    config.dev = !(process.env.NODE_ENV === 'production')
    // Init Nuxt.js
    const nuxt = new Nuxt(config)
    // Build only in dev mode
    if (config.dev) {
        const builder = new Builder(nuxt)
        builder.build()
    }
    app.use(nuxt.render)
    app.listen(port, host)
    console.log(`listening at ${host}:${port}`)
}
start();


