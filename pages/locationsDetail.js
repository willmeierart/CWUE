import React, { Component } from 'react'
import Specials from '../components/_locations/detail/Specials'
import Images from '../components/_locations/detail/Images'
import ResultModule from '../components/_locations/results/ResultModule'
import GoogleMap from '../components/_locations/GoogleMap'
import DataWrapper from '../components/_locations/DataWrapper'
import withData from '../lib/apollo/withData'

class Detail extends Component {
	constructor (props) {
		super(props)
	}
	componentWillMount () {
		console.log('active location', this.props.activeLocation)
		if (!this.props.activeLocation || this.props.activeLocation === {} || !this.props.activeLocation.name) {
			const { data: { _Carwash_USA_Express, _Cloned_CWUE }, onSetStaticLocList } = this.props
			onSetStaticLocList({ _Carwash_USA_Express, _Cloned_CWUE })
			console.log('NO ACTIVE LOCATION')
		}
	}

	componentDidUpdate (prevProps) {
		if (prevProps.staticLocationList !== this.props.staticLocationList && prevProps.staticLocationList.length === 0) {
			this.parseLocationFromURL()
		}
	}

	parseLocationFromURL = async () => {
		const { url: { query: { spec } }, staticLocationList, onSetActiveLocation } = this.props
		const thisLocation = staticLocationList.filter(loc => loc.name.toLowerCase().replace(/( )/g, '-') === spec).pop()
		onSetActiveLocation(thisLocation.name)
	}

	render () {
		const {
			mapCenter,
			mapZoom,
			allMarkers,
			activeResults,
			activeLocation,
			url,
			staticLocationList,
			vpDims,
			onSetMapCenter,
			onSetAllMarkers,
			onSetMapZoom
		} = this.props
		const specials = [
			'http://via.placeholder.com/500x350?text=special+1',
			'http://via.placeholder.com/500x350?text=special+2',
			'http://via.placeholder.com/500x350?text=special+3'
		]
		return (
			<section className='main-content-wrapper'>
				<h1>LOCATIONS</h1>
				<div className='top-content'>
					<div className='gridsec description-wrapper'>
						{activeLocation && activeLocation !== {} && <ResultModule detail location={activeLocation} />}
					</div>
					<div className='gridsec images-wrapper'>
						<Images
							images={[
								'http://via.placeholder.com/500x350?text=location+image+1',
								'http://via.placeholder.com/500x350?text=location+image+2',
								'http://via.placeholder.com/500x350?text=location+image+3',
								'http://via.placeholder.com/500x350?text=location+image+4',
								'http://via.placeholder.com/500x350?text=location+image+5'
							]}
						/>
					</div>
					<div className='gridsec map-wrapper'>
						<div className='map-inner'>
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
								vpDims={vpDims}
								onSetMapZoom={onSetMapZoom}
								page='detail'
							/>
						</div>
					</div>
					<div className='gridsec copy-wrapper' />
					<div className='gridsec services-wrapper' />
				</div>
				<div className='gridsec specials-wrapper'>
					<h3>
						<span />TODAY'S SPECIALS<span />
					</h3>
					<div className='specials-imgs'>
						<Specials specials={specials} />
					</div>
					<div className='specials-copy'>a bunch of copy about specials</div>
				</div>
				<style jsx>{`
					.top-content {
						width: 96%;
						height: 50vh;
						margin: 2vw;
						display: grid;
						grid-template-areas: 'details map' 'images map' 'copy services';
						grid-template-columns: repeat(2, 1fr);
						grid-template-rows: repeat(3, 1fr);
					}
					.gridsec {
						padding: 1em;
					}
					.description-wrapper {
						grid-area: details;
					}
					.images-wrapper {
						grid-area: images;
					}
					.copy-wrapper {
						grid-area: copy;
						overflow: scroll;
					}
					.map-wrapper {
						grid-area: map;
						position: relative;
					}
					.map-inner {
						height: 100%;
						display: flex;
						justify-content: center;
						align-items: flex-end;
					}
					.services-wrapper {
						grid-area: services;
					}
					.specials-wrapper {
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: space-around;
					}
					.specials-wrapper h3 {
						display: flex;
						width: 100%;
						justify-content: space-around;
						align-items: center;
					}
					.specials-wrapper h3 span {
						border-top: 1px solid black;
						width: 30vw;
					}
					.specials-imgs {
						margin: 2vh 0;
					}
				`}</style>
			</section>
		)
	}
}

export default withData(DataWrapper(Detail), 'locations') // only here do you pass in the extra param for client
