import React, { Component } from 'react'
// import { Loader } from 'react-loaders'
import Loader from 'react-loader'
// import Loader from 'react-loader-spinner'
import ApolloError from '../ui/ApolloError'
import { Transition } from 'react-transition-group'

// render loader if apollo taking forever to load

const options = {
	lines: 10,
	fps: 30,
	color: 'var(--color-blue)',
	position: 'relative'
}

export default function WithApolloLoader (ComposedComponent) {
	class WrappedComponent extends Component {
		constructor (props) {
			super(props)
			this.state = { canRefresh: true }
		}
		componentDidMount () {
			const { data: { loading }, onSetLoadingStatus } = this.props
			if (loading && onSetLoadingStatus) {
				onSetLoadingStatus(true)
			}
		}
		componentDidUpdate (prevProps) {
			const { data: { loading }, onSetLoadingStatus } = this.props
			if (prevProps.loading !== loading && !loading && onSetLoadingStatus && this.state.canRefresh) {
				onSetLoadingStatus(false)
			}
		}
		render () {
			const { error, loading } = this.props.data
			const duration = 1000
			const defaultStyle = { opacity: 0 }
			const transitionStyles = {
				entering: { opacity: 0, transition: `opacity ${duration}ms ease-in-out` },
				entered: { opacity: 1, transition: `opacity ${duration}ms ease-in-out` },
				exiting: { opacity: 0, transition: `opacity ${duration}ms ease-in-out` },
				exited: { opacity: 0, transition: `opacity ${duration}ms ease-in-out` }
			}
			return error ? (
				<ApolloError />
			) : (
				<div className={`${loading ? 'loading' : 'loaded'} apollo-loader-wrapper main-content-height`}>
					<Loader options={options} loaded={!loading}>
						<Transition appear in={!loading} timeout={0}>
							{state => (
								<div className='outer-wrapper' style={{ ...defaultStyle, ...transitionStyles[state] }}>
									<ComposedComponent {...this.props} />
								</div>
							)}
						</Transition>
					</Loader>
					<style jsx>{`
						.apollo-loader-wrapper.loading {
							display: flex;
							justify-content: center;
							align-items: center;
						}
					`}</style>
				</div>
			)
		}
	}
	return WrappedComponent
}
