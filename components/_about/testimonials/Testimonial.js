import PropTypes from 'prop-types'

const Testimonial = ({ left }) => {
	return (
		<div className='outer-container'>
			<div className='inner-container'>
				"You probably haven't heard of them pop-up tattooed next level forage. Hot chicken heirloom biodiesel, fixie
				food truck stumptown ramps. Hexagon meditation chambray butcher."
			</div>
			<style jsx>{`
				.outer-container {
					display: flex;
					justify-content: ${left ? 'flex-start' : 'flex-end'};
					margin: 3em;
				}
				.inner-container {
					width: 60%;
					text-align: ${l ? 'left' : 'right'};
					color: grey;
					font-size: .9em;
				}
			`}</style>
		</div>
	)
}

Testimonial.propTypes = {
	left: PropTypes.bool.isRequired
}

export default Testimonial
