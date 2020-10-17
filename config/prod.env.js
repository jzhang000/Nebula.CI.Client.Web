'use strict'
module.exports = {
    NODE_ENV: '"production"',
    API_BASE_URL: JSON.stringify(process.env.API_BASE_URL),
    AUTHORITY_URL: JSON.stringify(process.env.AUTHORITY_URL),
    CLIENT_URL: JSON.stringify(process.env.CLIENT_URL)
}