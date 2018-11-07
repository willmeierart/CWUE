const withPlugins = require('next-compose-plugins')
// const withOffline = require('next-offline')
// const withWorkers = require('@zeit/next-workers')
const nextEnv = require('next-env')
const dotenvLoad = require('dotenv-load')
dotenvLoad()
const withNextEnv = nextEnv()

module.exports = withPlugins([ [ withNextEnv ] ])
