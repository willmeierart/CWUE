const Specials = ({ specials }) => {
	return (
		<div className='specials-img-array'>
			{specials.map((special, i) => {
				return (
					<div key={`special-${i}`} className='special-img-wrapper'>
						<img alt={'special' + i} src={special} />
					</div>
				)
			})}
			<style jsx>{`
					.specials-img-array {
						display: flex
						justify-content: space-around
					}
					.special-img-wrapper {
						position: relative
						width: ${100 / (specials.length + 1)}%
					}
					img {
						width: 100%
						border: 1px solid black
					}
				`}</style>
		</div>
	)
}

export default Specials
