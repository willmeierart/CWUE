import React, { Component } from 'react'
import SearchBar from '../components/_locations/SearchBar'
import DataWrapper from '../components/_locations/DataWrapper'
import withData from '../lib/apollo/withData'

class Locations extends Component {
	componentDidMount () {
		const { data: { _Carwash_USA_Express, _Cloned_CWUE } } = this.props
		this.props.onSetStaticLocList({ _Carwash_USA_Express, _Cloned_CWUE })
		this.props.onSetActiveResultsList(this.props.staticLocationList)
	}
	render () {
		const {
			onGetUserLocation,
			userLocation,
			userIsLocated,
			activeResults,
			onSetActiveSearchPhrase,
			url,
			data,
			staticLocationList,
			onMakeUserLocationPage,
			isUserLocationPage,
			onSetMapCenter,
			onSetPromisePendingStatus,
			onSetActiveResultsList
		} = this.props
		return (
			<section>
				<h1>LOCATIONS</h1>
				<div className='search-wrapper'>
					<SearchBar
						setCenter={onSetMapCenter}
						activeResults={activeResults}
						onSetActiveSearchPhrase={onSetActiveSearchPhrase}
						data={data}
						staticLocationList={staticLocationList}
						setActiveResults={onSetActiveResultsList}
						userLocation={userLocation}
						onGetUserLocation={onGetUserLocation}
						onMakeUserLocationPage={onMakeUserLocationPage}
						isUserLocationPage={isUserLocationPage}
						userIsLocated={userIsLocated}
						onSetPromisePendingStatus={onSetPromisePendingStatus}
						url={url}
					/>
				</div>
				{/* {showBtn && <LocateMeBtn onMakeUserLocationPage={onMakeUserLocationPage} />} */}
				<style jsx>{`
					section {
						display: flex;
						flex-direction: column;
						align-items: center;
					}
					img {
						width: 100%;
						border: 1px solid black;
						border-radius: 3px;
					}
				`}</style>
			</section>
		)
	}
}

export default withData(DataWrapper(Locations), 'locations') // only here do you pass in the extra param for apollo client
