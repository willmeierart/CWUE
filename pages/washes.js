import AppProvider from '../lib/redux/AppProvider'
import TopSubMenu from '../components/layout/TopSubMenu'
import WashWrapper from '../components/_washes/WashWrapper'
import withData from '../lib/apollo/withData'

const Washes = ({ url }) => (
	<section>
		{/* <AppProvider url={url} title='Washes'/> */}
		<TopSubMenu url={url} />
		<WashWrapper url={url} />
		<style jsx>{``}</style>
	</section>
)

export default withData(Washes)
