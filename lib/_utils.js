// apparently react doesn't want you to iterate over children as a simple array, this allows it.
// useful in the case of e.g. applying 'fadeColors' to
export const forEachChild = (array, callback) => {
	return Array.prototype.forEach.call(array, child => {
		callback(child)
	})
}

// probably going to use something like this a lot (throw inside of position-relative container el):
export const renderGrid = (set, Component) => {
	return set.map((self, i) => {
		return (
			<div className='wrapper' key={i}>
				<Component self={self} />
				<style jsx>{`
					.wrapper {
						width: 100%;
						height: 100%;
						display: flex;
						justify-content: center;
						align-items: center;
						overflow: none;
					}
				`}</style>
			</div>
		)
	})
}

// for apollo data loading:
export const checkAllQueriesError = queries => {
	queries.forEach(query => {
		if ([ query ].error) {
			return <h1>¯\_(ツ)_/¯</h1>
		}
	})
}
