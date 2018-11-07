const { join } = require('path')
const { parse } = require('url')
const express = require('express')
const compression = require('compression')
const next = require('next')
const Router = require('./routes').Router
const sitemap = require('./sitemap')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const port = process.env.PORT || 3000
const handle = app.getRequestHandler()

app.prepare().then(() => {
	const server = express() // just an express server

	sitemap({ server })

	server.use(compression())

	server.use('/static', express.static('static')) // for sitemap

	Router.forEachPattern((
		page,
		pattern,
		defaultParams // this function comes from next-url-prettifier
	) =>
		server.get(pattern, (req, res) =>
			app.render(req, res, `/${page}`, Object.assign({}, defaultParams, req.query, req.params))
		)
	)

	server.get('*', (req, res) => {
		// const parsedUrl = parse(req.url, true)
		// const { pathname } = parsedUrl
		// if (pathname === '/service-worker.js') {
		// // if (pathname.indexOf('workers') !== -1) {
		// 	// for next-offline
		// 	const filePath = join(__dirname, '.next', pathname)
		// 	app.serveStatic(req, res, filePath)
		// } else {
		handle(req, res)
		// }
	})

	server.listen(port, err => {
		if (err) throw err
		console.log(`> Ready on http://localhost:${port}`)
	})
})
