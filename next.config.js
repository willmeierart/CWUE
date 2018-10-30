const withPlugins = require('next-compose-plugins')
const withWorkers = require('@zeit/next-workers')
const nextEnv = require('next-env')
const withOffline = require('next-offline')
const dotenvLoad = require('dotenv-load')
dotenvLoad()
const withNextEnv = nextEnv()

module.exports = withPlugins([
	[ withNextEnv ],
	[ withWorkers ]
	// [
	// 	withOffline,
	// 	{
	// 		devGeoSwSrc: '/lib/workers/geo.worker.js'
	// 	}
	// ]
])
