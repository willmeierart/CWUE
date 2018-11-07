import React, { Component } from 'react'
import ResultsPhrase from '../components/_locations/results/ResultsPhrase'
import ResultsList from '../components/_locations/results/ResultsList'
import SearchBar from '../components/_locations/SearchBar'
import GoogleMap from '../components/_locations/GoogleMap'
import DataWrapper from '../components/_locations/DataWrapper'
import withData from '../lib/apollo/withData'

class Results extends Component {
	componentWillMount () {
		const { activeResults, searchPhrase } = this.props
		if (!activeResults || activeResults.length > 1 || !searchPhrase || searchPhrase === '') {
			console.warn('NO ACTIVE SEARCH')
		}
	}
	pickLocation = location => {
		if (typeof location === 'string') {
			this.props.onSetActiveLocation(location)
		} else if (typeof location === 'object' && location.name) {
			this.props.onSetActiveLocation(location.name)
		} else {
			console.log('error picking location')
		}
	}
	render () {
		const {
			activeSearchPhrase,
			activeResults,
			onSetActiveSearchPhrase,
			url,
			data,
			staticLocationList,
			promisePendingStatus,
			onSetMapCenter,
			onSetPromisePendingStatus,
			onSetUserNotification,
			onSetActiveResultsList,
			mapCenter,
			mapZoom,
			onSetAllMarkers,
			allMarkers,
			onSetMapZoom,
			vpDims
		} = this.props
		const hasResults = activeResults.length > 0
		return (
			<section className='template-wrapper'>
				<div className='title-wrapper'>
					<h1>LOCATIONS</h1>
				</div>
				<section className='content-wrapper'>
					<div className='col col-left'>
						<ResultsPhrase
							activeResults={activeResults}
							searchPhrase={activeSearchPhrase}
							url={url}
							onSetUserNotification={onSetUserNotification}
							promisePendingStatus={promisePendingStatus}
						/>
						<div className='results-container content'>
							<ResultsList results={hasResults ? activeResults : staticLocationList} pickLocation={this.pickLocation} />
						</div>
					</div>
					<div className='col col-right'>
						<div className='search-wrapper content'>
							<SearchBar
								setCenter={onSetMapCenter}
								activeResults={activeResults}
								onSetActiveSearchPhrase={onSetActiveSearchPhrase}
								data={data}
								staticLocationList={staticLocationList}
								setActiveResults={onSetActiveResultsList}
								onSetPromisePendingStatus={onSetPromisePendingStatus}
								url={url}
							/>
						</div>
						<div className='map-wrapper content'>
							<GoogleMap
								staticLocationList={staticLocationList}
								url={url}
								center={mapCenter}
								zoom={mapZoom}
								setCenter={onSetMapCenter}
								setMarkers={onSetAllMarkers}
								activeResults={activeResults}
								allMarkers={allMarkers}
								dims={{ width: '40vw', height: '40vw' }}
								onSetMapZoom={onSetMapZoom}
								vpDims={vpDims}
								page='results'
							/>
						</div>
					</div>
				</section>
				<style jsx>{`
					section {
						width: 100%;
						box-sizing: border-box;
						position: relative;
						display: flex;
						flex-direction: column;
						align-items: center;
						padding: 2vw;
					}
					.content-wrapper {
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						align-items: flex-start;
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

export default withData(DataWrapper(Results), 'locations') // only here do you pass in the extra param for client
