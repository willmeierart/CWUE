import AppProvider from '../lib/redux/AppProvider'
import withData from '../lib/apollo/withData'

const FastPass = ({ url }) => (
  <AppProvider url={url} title='FastPass'>
    <div>FastPass</div>
    <style jsx>{``}</style>
  </AppProvider>
)

export default withData(FastPass)
