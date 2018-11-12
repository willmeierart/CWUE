import React, { Component } from 'react'
import PropTypes from 'prop-types'

// the message regarding user's search at top of results page

class ResultsPhrase extends Component {
	constructor (props) {
		super(props)
		this.state = {
			locationsNearPhrase: '',
			shouldFire: true,
			timesFired: 0,
			isMyLocation: true
		}
	}

	componentDidMount () {
		if (this.props.activeResults.length > 0) {
			this.parseMessageResultsState()
		}
	}

	componentDidUpdate (prevProps) {
		if (!this.props.promisePendingStatus) {
			if (this.props.activeResults !== prevProps.activeResults) {
				this.parseMessageResultsState()
			}
		}
		if (this.props.searchPhrase !== prevProps.searchPhrase) {
			this.setState({ shouldFire: true }, this.parseMessageResultsState)
		}
	}

	parseMessageResultsState = () => {
		// switcher for message at top of page
		const {
			activeResults,
			searchPhrase,
			url: { query: { spec } },
			onSetUserNotification,
			promisePendingStatus
		} = this.props
		const { timesFired, shouldFire } = this.state

		const hasResults = activeResults.length > 0
		const defaultErr = 'Please browse this list of all our locations:'

		const formatQS = qs => {
			const splitta = qs.split('-')
			return splitta.map(wd => wd.toUpperCase()).join(' ') // parse search from url into usable phrase
		}

		if (shouldFire) {
			this.setState({ timesFired: timesFired + 1 }, () => {
				if (searchPhrase) {
					if (hasResults) {
						console.log('searchphrase has results')
						onSetUserNotification({ alert: '', color: '' })
						this.setState({ locationsNearPhrase: `Locations near ${searchPhrase}`, shouldFire: false })
					} else {
						console.log('searchphrase no results')
						if (!promisePendingStatus) {
							onSetUserNotification({
								alert: `Sorry, looks like there are no locations near ${searchPhrase}`,
								color: 'red'
							})
							this.setState({
								locationsNearPhrase: `There are no locations near ${searchPhrase}. ${defaultErr}`,
								shouldFire: false
							})
						}
					}
				} else {
					if (spec) {
						if (hasResults) {
							console.log('no searchphrase has spec has results')
							onSetUserNotification({ alert: '', color: '' })
							this.setState({ locationsNearPhrase: `Locations near ${formatQS(spec)}`, shouldFire: false })
						} else {
							console.log('no searchphrase has spec no results')
							if (!promisePendingStatus) {
								onSetUserNotification({
									alert: `Sorry, looks like there are no locations near ${formatQS(spec)}`,
									color: 'red'
								})
								this.setState({
									locationsNearPhrase: `There are no locations near ${formatQS(spec)}. ${defaultErr}`,
									shouldFire: false
								})
							}
						}
					}
				}
				// }
			})
		}
	}

	render () {
		return (
			<h2 className='locations-near content'>
				{this.state.locationsNearPhrase}
				<hr />
			</h2>
		)
	}
}

ResultsPhrase.propTypes = {
	activeResults: PropTypes.array.isRequired,
	searchPhrase: PropTypes.string.isRequired,
	onSetUserNotification: PropTypes.func.isRequired,
	promisePendingStatus: PropTypes.bool.isRequired,
	url: PropTypes.object.isRequired
}

export default ResultsPhrase
