import React, { Component } from 'react'
// import { Loader } from 'react-loaders'
import Loader from 'react-loader'
// import Loader from 'react-loader-spinner'
import ApolloError from '../ui/ApolloError'

// render loader if apollo taking forever to load

const options = {
	lines: 10,
	fps: 30,
	color: 'var(--color-blue)',
	position: 'relative'
}

export default function WithApolloLoader (ComposedComponent) {
	// component
	class WrappedComponent extends Component {
		render () {
			return this.props.data.error ? (
				<ApolloError />
			) : (
				<div className='loader-wrapper'>
					<Loader options={options} loaded={!this.props.data.loading}>
						<ComposedComponent {...this.props} />
					</Loader>
					<style jsx>{`
						.loader-wrapper {
							min-height: 100px;
						}
					`}</style>
				</div>
			)
		}
	}
	return WrappedComponent
}
