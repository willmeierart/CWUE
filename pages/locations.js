import AppProvider from '../lib/redux/AppProvider'
import LocationsWrapper from '../components/_locations'
import withData from '../lib/apollo/withData'

const Locations = (props) => {
	return (
		<section>
			{/* <AppProvider url={props.url} title='Location' /> */}
			<LocationsWrapper {...props} />
		</section>
	)
}

export default withData(Locations, 'locations') // only here do you pass in the extra param for client
