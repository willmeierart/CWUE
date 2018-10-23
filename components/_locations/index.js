import React, { Component } from 'react'
import PropTypes from 'prop-types'
import equal from 'deep-equal'
import TemplateSwitcher from './templates/TemplateSwitcher'
import GoogleMap from './GoogleMap'
import SearchBar from './SearchBar'
import LocateMeBtn from './LocateMeBtn'
import DataManager from './data_managers/Wrapper'
import { getLatLng } from '../../lib/_locationUtils'
import { binder } from '../../lib/_utils'

import locData from '../../lib/_data/locData'
import ImperativeRouter from '../../server/ImperativeRouter'

// this is the sort of second-tier manager for the locations section of the site, mostly structural

class LocationsWrapper extends Component {
	constructor (props) {
		super(props)
		binder(this, [ 'setCenter', 'setMarkers', 'setActiveResults', 'showAllLocationsOnErr' ])
		this.fakeData = false
	}
	componentDidMount () {
		console.log(this.props.data)
		const { data: { _Carwash_USA_Express, _Cloned_CWUE } } = this.props
		this.props.onSetStaticLocList({ _Carwash_USA_Express, _Cloned_CWUE })
		this.setActiveResults()
	}

	setCenter (center) {
		// console.log(center)
		// if (center instanceof window.google.maps.LatLng) {
		//   console.log('setcenter correct format')
		//   this.props.onSetMapCenter(center)
		// } else {
		//   console.log('attempting to convert setcenter to correct format')
		//   const validLatLng = new window.google.maps.LatLng(center.lat, center.lng)
		//   const { lat, lng } = validLatLng
		//   this.props.onSetMapCenter({ lat: lat(), lng: lng() })
		//   // this.props.onSetMapCenter(validLatLng)
		// }
		this.props.onSetMapCenter(center)
	}
	setMarkers (markers) {
		this.props.onSetAllMarkers(markers)
	} // in case middleware logic needed

	showAllLocationsOnErr () {
		this.props.onSetActiveResultsList(this.props.staticLocationList)
	}

	setActiveResults (results) {
		const { onSetActiveResultsList } = this.props
		if (this.fakeData) {
			onSetActiveResultsList(locData)
		} else if (results) {
			this.props.onSetActiveResultsList(results)
			// console.log(results)
		}
	}

	goToRegion () {
		ImperativeRouter.push('locations', { state: 'region' }, false)
	}

	render () {
		const {
			mapCenter,
			mapZoom,
			allMarkers,
			onGetUserLocation,
			userLocation,
			userIsLocated,
			onSetActiveLocation,
			activeResults,
			activeLocation,
			pageState,
			activeSearchPhrase,
			onSetActiveSearchPhrase,
			url,
			data,
			staticLocationList,
			onSetMapZoom,
			vpDims,
			setTemplate,
			mapZoomModifier,
			setMapZoomModifier,
			onMakeUserLocationPage,
			isUserLocationPage,
			onSetUserNotification,
			onSetLocPageState,
			onSetPromisePendingStatus,
			promisePendingStatus
		} = this.props

		const getMapDims = (template) => {
			const large = { width: '96vw', height: '40vw' }
			const small = { width: '40vw', height: '40vw' }
			switch (template) {
				case 'initial':
					return large
				case 'results' || 'detail':
					return small
				default:
					return small
			}
		}
		return (
			<div>
				<div className='region-btn' onClick={this.goToRegion}>
					regions page
				</div>
				<TemplateSwitcher
					staticLocationList={staticLocationList}
					showAllLocationsOnErr={this.showAllLocationsOnErr}
					setTemplate={setTemplate}
					template={pageState}
					onGetUserLocation={onGetUserLocation}
					onSetActiveLocation={onSetActiveLocation}
					setActiveResults={this.setActiveResults}
					activeResults={activeResults}
					userLocation={userLocation}
					userIsLocated={userIsLocated}
					activeLocation={activeLocation}
					searchPhrase={activeSearchPhrase}
					onMakeUserLocationPage={onMakeUserLocationPage}
					isUserLocationPage={isUserLocationPage}
					onSetUserNotification={onSetUserNotification}
					onSetLocPageState={onSetLocPageState}
					promisePendingStatus={promisePendingStatus}
					url={url}
				>
					<h1>LOCATIONS</h1>
					<SearchBar
						setCenter={this.setCenter}
						setTemplate={setTemplate}
						activeResults={activeResults}
						onSetActiveSearchPhrase={onSetActiveSearchPhrase}
						data={data}
						staticLocationList={staticLocationList}
						setActiveResults={this.setActiveResults}
						userLocation={userLocation}
						onGetUserLocation={onGetUserLocation}
						setMapZoomModifier={setMapZoomModifier}
						onMakeUserLocationPage={onMakeUserLocationPage}
						isUserLocationPage={isUserLocationPage}
						userIsLocated={userIsLocated}
						onSetPromisePendingStatus={onSetPromisePendingStatus}
						url={url}
					/>
					<GoogleMap
						staticLocationList={staticLocationList}
						url={url}
						template={pageState}
						center={mapCenter}
						zoom={mapZoom}
						setCenter={this.setCenter}
						setMarkers={this.setMarkers}
						activeResults={activeResults}
						allMarkers={allMarkers}
						dims={getMapDims(pageState)}
						onSetMapZoom={onSetMapZoom}
						setTemplate={setTemplate}
						mapZoomModifier={mapZoomModifier}
						vpDims={vpDims}
					/>
				</TemplateSwitcher>
				<style jsx>{`
					.region-btn {
						border: 1px solid black;
						border-radius: 5px;
						width: 100px;
						text-align: center;
						cursor: pointer;
						background: red;
						color: white;
						margin: 2em;
					}
				`}</style>
			</div>
		)
	}
}

LocationsWrapper.propTypes = {
	activeLocation: PropTypes.object,
	activeResults: PropTypes.array.isRequired,
	activeSearchPhrase: PropTypes.string.isRequired,
	data: PropTypes.object.isRequired,
	mapCenter: PropTypes.oneOfType([ PropTypes.object, PropTypes.string ]),
	allMarkers: PropTypes.array.isRequired,
	mapZoom: PropTypes.number.isRequired,
	onGetUserLocation: PropTypes.func.isRequired,
	onSetActiveLocation: PropTypes.func.isRequired,
	onSetActiveResultsList: PropTypes.func.isRequired,
	onSetLocPageState: PropTypes.func.isRequired,
	onSetAllMarkers: PropTypes.func.isRequired,
	onSetMapCenter: PropTypes.func.isRequired,
	onSetMapZoom: PropTypes.func.isRequired,
	onSetStaticLocList: PropTypes.func.isRequired,
	onMakeUserLocationPage: PropTypes.func.isRequired,
	isUserLocationPage: PropTypes.bool.isRequired,
	pageState: PropTypes.string.isRequired,
	serverState: PropTypes.object,
	setTemplate: PropTypes.func.isRequired,
	staticLocationList: PropTypes.array.isRequired,
	userLocation: PropTypes.oneOfType([ PropTypes.object, PropTypes.string ]),
	vpDims: PropTypes.object.isRequired,
	mapZoomModifier: PropTypes.number.isRequired,
	setMapZoomModifier: PropTypes.func.isRequired,
	url: PropTypes.object.isRequired,
	onSetUserNotification: PropTypes.func.isRequired,
	onSetPromisePendingStatus: PropTypes.func.isRequired,
	promisePendingStatus: PropTypes.bool.isRequired
}

export default DataManager(LocationsWrapper)
