import React, { Component } from 'react'
import AboutWrapper from '../components/_about/AboutWrapper'
import TopSubMenu from '../components/layout/TopSubMenu'
import withData from '../lib/apollo/withData'

class About extends Component {
	render () {
		return (
			<section>
				<TopSubMenu url={this.props.url} />
				<AboutWrapper url={this.props.url} />
				<style jsx>{``}</style>
			</section>
		)
	}
}

export default withData(About)
