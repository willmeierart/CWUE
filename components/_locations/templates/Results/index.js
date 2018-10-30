import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Loader from 'react-loaders'
import UserLocationManager from './UserLocationManager'
import ResultsList from './ResultsList'
import { binder } from '../../../../lib/_utils'

// this view particularly has a lot going on, so it gets its own folder

class Results extends Component {
	constructor (props) {
		super(props)
		this.state = {
			locationsNearPhrase: '',
			shouldFire: true,
			timesFired: 0,
			isMyLocation: true
		}
		binder(this, [ 'pickLocation', 'parseMessageResultsState', 'setLocationsNearPhrase' ])
	}

	componentDidMount () {
		console.warn('COMPONENT DID MOUNT', this.props.url.query)

		this.updateMyLocation()

		if (
			this.props.activeResults.length > 0 ||
			this.props.userLocation === 'denied' ||
			this.props.userLocation === 'unavailable'
		) {
			this.parseMessageResultsState()
		}
	}

	componentDidUpdate (prevProps, prevState) {
		// console.log(this.props.activeResults, prevProps.activeResults)
		if (!this.props.promisePendingStatus) {
			if (this.props.activeResults !== prevProps.activeResults) {
				this.parseMessageResultsState()
			}
			// else {
			// 	if (this.state.shouldFire) {
			// 		console.warn('componentdidupdate SETTING TIMEOUT', this.state.shouldFire, this.state.timesFired)
			// 		setTimeout(this.parseMessageResultsState, 1500)
			// 	}
			// }
		}
		if (this.props.searchPhrase !== prevProps.searchPhrase) {
			// if (!this.props.isUserLocationPage && !this.state.isMyLocation) {
			this.updateMyLocation()
			// }
			console.log('SEARCHPHRASE NOT SAME')
			this.setState({ shouldFire: true }, this.parseMessageResultsState)
		}
	}

	updateMyLocation () {
		const { url: { query: { spec } } } = this.props
		if (spec === 'my-location') {
			this.props.onMakeUserLocationPage(true) // for SSR nav to my-location route
		} else {
			this.setState({ isMyLocation: false })
		}
	}

	pickLocation (location) {
		if (typeof location === 'string') {
			this.props.onSetActiveLocation(location)
		} else if (typeof location === 'object' && location.name) {
			this.props.onSetActiveLocation(location.name)
		} else {
			console.log('error picking location')
		}
	}

	parseMessageResultsState () {
		// switcher for message at top of page
		const {
			activeResults,
			searchPhrase,
			url: { query: { spec } },
			onSetUserNotification,
			userLocation,
			promisePendingStatus
		} = this.props
		const { timesFired, isMyLocation, shouldFire } = this.state

		const hasResults = activeResults.length > 0
		const defaultErr = 'Please browse this list of all our locations:'

		const formatQS = (qs) => {
			const splitta = qs.split('-')
			return splitta.map((wd) => wd.toUpperCase()).join(' ') // parse search from url into usable phrase
		}

		if (shouldFire) {
			this.setState({ timesFired: timesFired + 1 }, () => {
				// console.log(
				// 	'checking usernotification: ',
				// 	'hasResults - ',
				// 	hasResults,
				// 	'searchPhrase - ',
				// 	searchPhrase,
				// 	'spec - ',
				// 	spec,
				// 	'userlocation - ',
				// 	userLocation,
				// 	'promisePendingStatus',
				// 	promisePendingStatus
				// )
				if (isMyLocation) {
					if (userLocation === 'unavailable' || userLocation === 'denied') {
						onSetUserNotification({
							alert: 'Sorry, we are unable to get your geolocation',
							color: 'red'
						})
						this.setState({ locationsNearPhrase: defaultErr, shouldFire: false })
					} else {
						if (hasResults) {
							console.log('mylocation has results')
							onSetUserNotification({ alert: '', color: '' })
							this.setState({ locationsNearPhrase: 'Locations near me', shouldFire: false })
						} else {
							console.log('mylocation no results')
							if (!promisePendingStatus) {
								onSetUserNotification({
									alert: 'Sorry, looks like there are no nearby locations',
									color: 'red'
								})
								this.setState({
									locationsNearPhrase: `There are no nearby locations. ${defaultErr}`,
									shouldFire: false
								})
							}
						}
					}
				} else {
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
				}
			})
		}
	}

	setLocationsNearPhrase (keyword) {
		// const defaultErr = 'Please browse this list of all our locations:'
		// let locationsNearPhrase = ''
		// switch (keyword) {
		// }
		// this.setState({ locationsNearPhrase })
	}

	render () {
		const { children, activeResults, staticLocationList } = this.props
		const hasResults = activeResults.length > 0
		const Title = children[0]
		const SearchBar = children[1]
		const Map = children[2]

		return (
			<section className='template-wrapper'>
				{this.state.shouldFire && <Loader type='line-spin-fade-loader' active />}
				<div className='title-wrapper'>{Title}</div>
				<section className='content-wrapper'>
					<div className='col col-left'>
						<h2 className='locations-near content'>
							{this.state.locationsNearPhrase}
							<hr />
						</h2>
						<div className='results-container content'>
							<ResultsList results={hasResults ? activeResults : staticLocationList} pickLocation={this.pickLocation} />
						</div>
					</div>
					<div className='col col-right'>
						<div className='search-wrapper content'>{SearchBar}</div>
						<div className='map-wrapper content'>{Map}</div>
					</div>
				</section>
				<style jsx>{`
					section {
						width: 100%;
						box-sizing: border-box;
						position: relative;
						display: ${this.state.shouldFire ? 'none' : 'flex'};
						justify-content: center;
					}
					.template-wrapper {
						display: flex;
						flex-direction: column;
						align-items: center;
						padding: 2vw;
					}
					.content-wrapper {
						display: flex;
						flex-direction: row;
						justify-content: space-between;
					}
					.col {
						width: 48%;
						display: flex;
						flex-direction: column;
					}
					.col-left {
						align-items: flex-start;
					}
					.col-right {
						align-items: center;
					}
					.locations-near {
						margin: 0;
					}
					.content {
						width: 100%;
					}
					.map-wrapper {
						display: flex;
						justify-content: center;
					}
				`}</style>
			</section>
		)
	}
}

Results.propTypes = {
	userLocation: PropTypes.oneOfType([ PropTypes.object, PropTypes.string ]),
	userIsLocated: PropTypes.bool.isRequired,
	onMakeUserLocationPage: PropTypes.func.isRequired,
	isUserLocationPage: PropTypes.bool,
	onSetActiveLocation: PropTypes.func.isRequired,
	onGetUserLocation: PropTypes.func.isRequired,
	activeResults: PropTypes.array.isRequired,
	setActiveResults: PropTypes.func.isRequired,
	searchPhrase: PropTypes.string.isRequired,
	showAllLocationsOnErr: PropTypes.func.isRequired,
	url: PropTypes.object.isRequired,
	onSetUserNotification: PropTypes.func.isRequired,
	promisePendingStatus: PropTypes.bool.isRequired
}

export default UserLocationManager(Results)
