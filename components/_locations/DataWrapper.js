// this is the datamanager for the entire locations section, handles the route-based-page-view logic, etc

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { allEachLocations } from '../../lib/apollo/queries'
import {
	getUserLocation,
	setMapZoom,
	setAllMarkers,
	setMapCenter,
	setActiveLocation,
	setActiveResultsList,
	setActiveSearchPhrase,
	setStaticLocList,
	makeUserLocationPage,
	setUserNotification,
	setPromisePendingStatus
} from '../../lib/redux/actions'
import WithApolloLoader from '../hoc/WithApolloLoader'

export default function DataManager (ComposedComponent) {
	class WrappedComponent extends Component {
		render () {
			return <ComposedComponent {...this.props} />
		}
	}
	return compose(graphql(allEachLocations))(
		connect(mapStateToProps, mapDispatchToProps)(WithApolloLoader(WrappedComponent))
	)
}

function mapStateToProps (state) {
	const {
		location: {
			userLocation,
			userIsLocated,
			mapCenter,
			mapZoom,
			allMarkers,
			activeLocation,
			activeResults,
			activeSearchPhrase,
			staticLocationList,
			isUserLocationPage,
			promisePendingStatus
		},
		env: { vpDims, swAvailable }
	} = state
	return {
		userLocation,
		userIsLocated,
		isUserLocationPage,
		mapCenter,
		mapZoom,
		allMarkers,
		activeLocation,
		activeResults,
		activeSearchPhrase,
		staticLocationList,
		vpDims,
		promisePendingStatus,
		swAvailable
	}
}

function mapDispatchToProps (dispatch) {
	return {
		onGetUserLocation: (ops, callback) => dispatch(getUserLocation(ops, callback)),
		onSetMapCenter: (center) => dispatch(setMapCenter(center)),
		onSetMapZoom: (zoom) => dispatch(setMapZoom(zoom)),
		onSetAllMarkers: (markers) => dispatch(setAllMarkers(markers)),
		onSetActiveLocation: (location) => dispatch(setActiveLocation(location)),
		onSetActiveResultsList: (list) => dispatch(setActiveResultsList(list)),
		onSetActiveSearchPhrase: (phrase) => dispatch(setActiveSearchPhrase(phrase)),
		onSetStaticLocList: (locObj) => dispatch(setStaticLocList(locObj)),
		onMakeUserLocationPage: (bool) => dispatch(makeUserLocationPage(bool)),
		onSetUserNotification: (alertObj) => dispatch(setUserNotification(alertObj)),
		onSetPromisePendingStatus: (bool) => dispatch(setPromisePendingStatus(bool))
	}
}

DataManager.propTypes = {
	userLocation: PropTypes.oneOfType([ PropTypes.object, PropTypes.string ]).isRequired,
	userIsLocated: PropTypes.bool.isRequired,
	isUserLocationPage: PropTypes.bool.isRequired,
	onMakeUserLocationPage: PropTypes.func.isRequired,
	mapCenter: PropTypes.object,
	mapZoom: PropTypes.number,
	allMarkers: PropTypes.array,
	onSetAllMarkers: PropTypes.func.isRequired,
	activeLocation: PropTypes.object,
	activeResults: PropTypes.array,
	activeSearchPhrase: PropTypes.string,
	onSetActiveSearchPhrase: PropTypes.func,
	onSetStaticLocList: PropTypes.func,
	staticLocationList: PropTypes.array,
	vpDims: PropTypes.object,
	onSetUserNotification: PropTypes.func.isRequired,
	onSetPromisePendingStatus: PropTypes.func.isRequired,
	promisePendingStatus: PropTypes.bool.isRequired,
	swAvailable: PropTypes.bool.isRequired
}
