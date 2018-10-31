import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
// import { updatedDiff } from 'deep-object-diff'
import difference from 'lodash.difference'
import MapManager from './data_managers/Map'
import { binder } from '../../lib/_utils'
import { getCoordsFromAddress, makeMarker, reverseGeocode } from '../../lib/_locationUtils'
import equal from 'deep-equal'

// all mechanics relating to map, markers, etc

class GoogleMap extends Component {
	constructor (props) {
		super(props)
		this.state = {
			bounds: null
		}
		binder(this, [
			'setCenter',
			'setCenterViaMarkers',
			'setBounds',
			'toggleActiveMarkers',
			'setAllMarkers',
			'clearAllMarkers'
		])
	}

	componentWillUnmount () {
		console.log('unmounting')
		// this.clearAllMarkers()
	}

	componentDidMount () {
		console.warn('__MAP__componentDidMount__')
		const init = () => {
			const { template, onIdle, initialMapStyles, geoJSONstyles, url } = this.props
			if (!window.google) {
				console.warn('no google')
				setTimeout(init, 500)
			} else {
				const { google } = window
				const mapNode = ReactDOM.findDOMNode(this.mapDOM)
				const { center, allMarkers, activeResults, zoom, mapZoomModifier } = this.props

				let mapCenter
				if (typeof center === 'object') {
					// handle initial centering of map
					if (center instanceof google.maps.LatLng) {
						mapCenter = center
					} else {
						const centerify = new google.maps.LatLng(center.lat, center.lng)
						const { lat, lng } = centerify
						mapCenter = { lat: lat(), lng: lng() }
						console.warn('init: center invalid, being converted to latlng -- ', 'old', center, 'new', mapCenter)
					}
				} else {
					console.log('init: center is a string, reverse geocoding')
					const reverseGeocoded = reverseGeocode(center)
					const { lat } = reverseGeocoded.geometry.location
					const { lng } = reverseGeocoded.geometry.location
					mapCenter = { lat: lat(), lng: lng() }
				}

				this.map = new google.maps.Map(mapNode, {
					// init the map
					zoom: zoom + mapZoomModifier,
					center: mapCenter,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					disableDefaultUI: true, // disable controls:
					styles: template === 'initial' ? initialMapStyles : null
					// gestureHandling: 'none'
				})
				if (
					template === 'results' ||
					url.asPath.indexOf('results') !== -1
					// || (template === 'detail' || url.asPath.indexOf('detail') !== -1)
				) {
					// behavior different for results view than initial
					if (onIdle) {
						google.maps.event.addListener(this.map, 'idle', () => {
							console.warn('__mount__: MAP IS IDLING')
							// this.setAllMarkers()
							this.toggleActiveMarkers()
						})
					}
					if (
						(activeResults.length === 0 && allMarkers.length === 0) ||
						activeResults.length !== allMarkers.length ||
						allMarkers.indexOf(undefined) !== -1
					) {
						// console.warn('__mount__: SET ALL MARKERS')
						this.setAllMarkers() // set markers if they don't exist
						// console.log('componentDidMount first op')
						if (activeResults.length === 1) {
							this.props.onSetMapZoom(14)
						}
					} else {
						if (activeResults.length === 1) {
							this.props.onSetMapZoom(14)
						}
						if (this.props.allMarkers.indexOf(undefined) === -1) {
							// console.warn('__mount__: TOGGLE ACTIVE MARKERS')

							// console.log('componentDidMount second op')
							this.toggleActiveMarkers() // otherwise just pick from all markers which should be displayed
						}
					}
				} else if (template === 'initial') {
					// load geojson mask into map if initial view
					this.map.data.loadGeoJson('/static/geoData/US_GEO.json')
					this.map.data.setStyle(geoJSONstyles)
				} else if (template === 'detail' || url.asPath.indexOf('detail') !== -1) {
					// console.warn('__mount__: TEMPLATE DETAIL, TOGGLE ACTIVE MARKERS')
					this.toggleActiveMarkers()
				}
			}
		}
		init()
	}

	componentDidUpdate (prevProps, prevState) {
		console.log('__MAP__componentDidUpdate__')
		const { lat, lng } = this.map.center
		const { center } = this.props

		const filteredMarkers = this.props.allMarkers.filter((marker) => marker.map === this.map)
		const newMarkersMap = this.props.allMarkers.map((marker) => marker.map)
		const prevMarkersMap = prevProps.allMarkers.map((marker) => marker.map)
		if (prevProps.activeResults.length === 0 && this.props.activeResults.length > 0) {
			// handle initial SSR load where active results not yet loaded
			// console.warn('__update__: THERE WERE NO ACTIVE RESULTS BUT NOW THERE ARE')
			this.toggleActiveMarkers()
			console.warn('SET CENTER VIA MARKERS 1')
			this.setCenterViaMarkers(filteredMarkers)
		}
		if (!equal(this.props, prevProps)) {
			// console.log('not all props same')
			// console.warn('props not same - UPDATED: ', updatedDiff(this.props, prevProps), this.props, prevProps)

			if (this.props.url.query.state !== 'results') {
				// this.toggleActiveMarkers()
				if (this.props.template === 'initial' && this.props.url.state === 'initial') {
					// make sure geojson data loaded back in on clientside nav to initial view
					// console.warn('__update__: IS INITIAL VIEW')
					this.map.data.loadGeoJson('/static/geoData/US_GEO.json')
					this.map.data.setStyle(this.props.geoJSONstyles)
					this.props.setCenter({ lat: 39.8283459, lng: -98.57947969999998 }) // hard-coded latlng for geographic center of US
					this.clearAllMarkers()
				}
			}
			if (this.props.zoom !== prevProps.zoom || this.props.mapZoomModifier !== prevProps.mapZoomModifier) {
				console.warn('__update__: ZOOM DID UPDATE')
				this.map.setZoom(this.props.zoom + this.props.mapZoomModifier)
			}
			if (this.props.activeResults !== prevProps.activeResults) {
				console.warn('__update__: ACTIVE RESULTS DID UPDATE')
				this.toggleActiveMarkers() // if results change, change the markers
				console.log(this.props.activeResults)
				if (this.props.activeResults.length === 1) {
					console.log('only one result')
					this.props.onSetMapZoom(14)
				}
			}
			if (difference(prevMarkersMap, newMarkersMap).length > 0 /*&& prevMarkersMap.length > 0*/) {
				// console.warn('__update__: MAP MARKERS DID UPDATE', difference(prevMarkersMap, newMarkersMap))
				// this.toggleActiveMarkers()
				if (this.props.template === 'results' || this.props.template === 'detail') {
					console.warn('SET CENTER VIA MARKERS 2')
					this.setCenterViaMarkers(filteredMarkers)
				}
			}
			if (this.props.center !== prevProps.center || center !== { lat: lat(), lng: lng() }) {
				console.warn('__update__: CENTER DID UPDATE')

				this.setCenterViaMarkers(filteredMarkers)

				if (center !== { lat: lat(), lng: lng() }) {
					console.warn('SET CENTER AS:', center)
					this.map.setCenter(center)
				}
			}
			if (this.state.bounds !== prevState.bounds) {
				console.warn('__update__: BOUNDS DID UPDATE')
				if (this.props.template === 'results') {
					console.warn('SET CENTER VIA MARKERS 3')
					this.setCenterViaMarkers(filteredMarkers)
				}
			}
		}
	}

	shouldComponentUpdate (nextProps) {}

	setBounds (marker) {
		const mainAction = () => {
			if (marker) {
				this.setState({ bounds: this.state.bounds.extend(marker) }, () => {
					// console.log('BOUNDS', this.state.bounds)
					this.map.fitBounds(this.state.bounds) // center map around markers
				})
			}
		}
		if (!this.state.bounds) {
			// init bounds
			this.setState({ bounds: new window.google.maps.LatLngBounds() }, mainAction)
		} else {
			mainAction()
		}
	}

	setCenterViaMarkers (markers) {
		if (markers.length > 1) {
			// only calculate bounds frame if more than one marker
			let maxLat = null
			let minLat = null
			let maxLng = null
			let minLng = null

			this.setState({ bounds: null }, () => {
				const markerCenter = markers.reduce(
					(obj, marker) => {
						if (maxLat === null || marker.position.lat > maxLat) maxLat = marker.position.lat()
						if (minLat === null || marker.position.lat < minLat) minLat = marker.position.lat()
						if (maxLng === null || marker.position.lng > maxLng) maxLng = marker.position.lng()
						if (minLng === null || marker.position.lng < minLng) minLng = marker.position.lng()
						obj.coords.lat = parseFloat(((maxLat + minLat) / 2).toFixed(5))
						obj.coords.lng = parseFloat(((maxLng + minLng) / 2).toFixed(5))
						const invokedPos = { lat: marker.position.lat(), lng: marker.position.lng() }
						this.setBounds(invokedPos) // expand map bounds to the largest needed to show all markers
						return obj
					},
					{ coords: { lat: 0, lng: 0 } }
				)
				if (markerCenter.coords.lat === 0 && markerCenter.coords.lng === 0) {
					console.warn('markercenter.Coords are 0,0 - defaulting to props.center')
					this.setCenter(this.props.center)
				} else {
					this.setCenter(markerCenter.coords)
				}
			})
		} else if (markers.length === 1) {
			const { lat, lng } = markers[0].position
			this.setCenter({ lat: lat(), lng: lng() })
		}
	}

	setCenter (center) {
		const setCenterType = (center) => {
			if (typeof center === 'string') {
				getCoordsFromAddress(center).then((coords) => {
					console.warn('center was a string, now coords are:', coords)
					this.props.setCenter(coords)
				})
			} else {
				this.props.setCenter(center)
				// this.props.onSetMapZoom(this.props.zoom)
			}
		}
		if (center) {
			setCenterType(center)
		} else {
			console.warn('no center, using props.center')
			setCenterType(this.props.center)
		}
		if (this.props.mapZoomModifier !== 0) {
			const zoom = this.props.zoom + this.props.mapZoomModifier
			this.map.setZoom(zoom)
		}
	}

	setAllMarkers () {
		// weirdly, this is the way you do it -- not by adding and removing markers but by adding all markers and toggling their 'map' property between null and this.map
		const { staticLocationList, activeResults, setMarkers } = this.props
		const activeMarkerTitles = activeResults.map((result) => result.name)
		const mappedAsMarkers = staticLocationList.map((loc) => {
			const marker = makeMarker(loc)
			// console.log(marker)
			const newMarker = new window.google.maps.Marker({
				position: marker.position,
				animation: marker.animation,
				title: marker.title,
				label: marker.label || '',
				map: activeMarkerTitles.indexOf(marker.title) !== -1 ? this.map : null,
				icon: marker.icon || null
			})
			return newMarker
		})
		// console.log('setallmarkers: ', mappedAsMarkers, activeMarkerTitles)
		setMarkers(mappedAsMarkers)
	}

	clearAllMarkers () {
		// console.warn('all markers were cleared')
		const { allMarkers, setMarkers } = this.props
		const newMarkers = allMarkers.map((marker) => {
			marker.map = null
			marker.setMap(null)
			return marker
		})
		setMarkers(newMarkers)
	}

	toggleActiveMarkers () {
		const { activeResults, allMarkers, setMarkers, template } = this.props
		const activeMarkerTitles = activeResults.map((result) => result.name)
		const newMarkers = allMarkers.map((marker) => {
			if (
				activeMarkerTitles.indexOf(marker.title) !== -1 &&
				(template === 'results' || template === 'detail' || template === 'region')
			) {
				marker.map = this.map
				marker.setMap(this.map)
			} else {
				marker.map = null
				marker.setMap(null)
			}
			return marker
		})
		// console.log('TOGGLE ACTIVE MARKERS: ', allMarkers, newMarkers, activeMarkerTitles)
		setMarkers(newMarkers)
	}

	render () {
		const { dims: { width, height }, template } = this.props
		return (
			<div className='map-container'>
				<div
					onChange={this.updateAllMapProps}
					id='map'
					style={{ width: '100%', height: '100%' }}
					ref={(map) => {
						this.mapDOM = map
					}}
				/>
				<style jsx>{`
					.map-container {
						pointer-events: ${template === 'initial' ? 'none' : 'all'};
						cursor: default !important;
						width: ${width};
						height: ${height};
					}
				`}</style>
			</div>
		)
	}
}

GoogleMap.propTypes = {
	center: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
	dims: PropTypes.object.isRequired,
	geoJSONstyles: PropTypes.object.isRequired,
	initialMapStyles: PropTypes.array.isRequired,
	allMarkers: PropTypes.array.isRequired,
	onIdle: PropTypes.bool,
	onSetMapZoom: PropTypes.func.isRequired,
	setTemplate: PropTypes.func.isRequired,
	template: PropTypes.string.isRequired,
	url: PropTypes.object.isRequired,
	vpDims: PropTypes.object.isRequired,
	mapZoomModifier: PropTypes.number.isRequired,
	zoom: PropTypes.number.isRequired,
	activeResults: PropTypes.array.isRequired,
	setCenter: PropTypes.func.isRequired,
	setMarkers: PropTypes.func.isRequired
}

export default MapManager(GoogleMap)
