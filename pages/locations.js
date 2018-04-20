import AppProvider from '../lib/redux/AppProvider'
import LocationsWrapper from '../components/_locations'
import withData from '../lib/apollo/withData'

const Locations = props => {
  return (
    <AppProvider url={props.url} title='Location'>
      <LocationsWrapper {...props} />
    </AppProvider>
  )
}

export default withData(Locations, 'locations')
