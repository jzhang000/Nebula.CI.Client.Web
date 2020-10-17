'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    API_BASE_URL: JSON.stringify(process.env.API_BASE_URL),
    AUTHORITY_URL: JSON.stringify(process.env.AUTHORITY_URL),
    CLIENT_URL: JSON.stringify(process.env.CLIENT_URL)
})