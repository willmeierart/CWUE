import AppProvider from '../lib/redux/AppProvider'
import withData from '../lib/apollo/withData'

const FastPass = ({ url }) => (
	<section>
		{/* <AppProvider url={url} title='FastPass'/> */}
		<div>FastPass</div>
		<style jsx>{``}</style>
	</section>
)

export default withData(FastPass)
