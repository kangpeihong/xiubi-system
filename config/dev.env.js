'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"https://server.xiubi.com.cn:8000"',
  IMAGE_URL: '"https://server.xiubi.com.cn:8000"'
  // BASE_API: '"https://api.auauz.net"'
})
