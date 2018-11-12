import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
import { homePage } from '../../lib/apollo/queries'
import WithApolloLoader from '../hoc/WithApolloLoader'
import FastPassCallout from './FastPassCallout'
import StoryCallout from './StoryCallout'
import BrandLogosImage from './BrandLogosImage'

const HomeWrapper = props => (
	<div className='outer-wrapper'>
		<div className='inner-wrapper'>
			<div className='top-section'>
				<div className='callouts'>
					<FastPassCallout />
					<StoryCallout />
				</div>
				<div className='top-img' />
			</div>
			<BrandLogosImage />
		</div>
		<style jsx>{`
			.outer-wrapper {
				width: 100vw;
			}
			.inner-wrapper {
				display: flex;
				flex-direction: column;
				width: 100vw;
			}
			.top-section {
				display: flex;
				width: 100%;
			}
			.callouts {
				display: flex;
				flex-direction: column;
			}
			.top-img {
				display: flex;
				flex-shrink: 0;
				width: 100%;
				height: 100%;
				background: var(--color-blue);
				margin: 1.5vw 0;
				width: 75vw;
				height: calc(50vw + 1.5vw);
			}
			@media screen and (max-width: 1000px) {
				.top-section {
					flex-direction: column-reverse;
					margin-top: 1.5vw;
				}
				.callouts {
					flex-direction: row;
				}
				.top-img {
					width: 100vw;
					margin: 0;
				}
			}
		`}</style>
	</div>
)

export default compose(graphql(homePage))(WithApolloLoader(HomeWrapper))

HomeWrapper.propTypes = {
	data: PropTypes.object.isRequired
}
