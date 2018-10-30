import React, { Component } from 'react'
import AppProvider from '../lib/redux/AppProvider'
import HomeWrapper from '../components/_home'
import withData from '../lib/apollo/withData'

class HomePage extends Component {
	render () {
		return (
			<section>
				{/* <AppProvider url={this.props.url} title='Home' /> */}
				<HomeWrapper url={this.props.url} />
			</section>
		)
	}
}

export default withData(HomePage)
