import React, { Component } from 'react'
// import ImperativeRouter from '../server/ImperativeRouter'

export default class Error extends Component {
	static getInitialProps ({ res, err }) {
		const statusCode = res ? res.statusCode : err ? err.statusCode : null
		// ImperativeRouter.push('index', {}, false)
		return { statusCode }
	}
	render () {
		return null
	}
}
