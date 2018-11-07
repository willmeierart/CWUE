import React, { Component } from 'react'
import HomeWrapper from '../components/_home'
import withData from '../lib/apollo/withData'

class HomePage extends Component {
	static pageTransitionDelayEnter = true
	constructor (props) {
		super(props)
		this.state = { loaded: false }
	}

	componentDidMount () {
		this.timeoutId = setTimeout(() => {
			this.props.pageTransitionReadyToEnter()
			this.setState({ loaded: true })
		}, 2000)
	}

	componentWillUnmount () {
		if (this.timeoutId) clearTimeout(this.timeoutId)
	}

	render () {
		return (
			<section>
				<HomeWrapper url={this.props.url} />
			</section>
		)
	}
}

export default withData(HomePage)
