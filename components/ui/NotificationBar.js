import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Transition } from 'react-transition-group'

// popup bar at top of page for user notifications

class NotificationBar extends Component {
	constructor (props) {
		super(props)
		this.state = { in: false }
	}
	componentDidMount () {
		setTimeout(() => {
			this.setState({ in: true })
		}, 500)

		setTimeout(() => {
			this.props.onSetUserNotification({ alert: '', color: '' })
		}, 2500)
	}
	delayExit = () => {
		setTimeout(() => {
			this.setState({ in: false })
		}, 500)
	}
	render () {
		const { alert, color } = this.props
		const defaultStyle = {
			opacity: 0,
			transition: 'opacity 500ms ease-in-out'
		}
		const transitionStyles = {
			entering: {
				opacity: 0
			},
			entered: {
				opacity: 1
			},
			exiting: {
				opacity: 0
			}
		}
		return (
			<Transition onExit={this.delayExit} onExiting={this.delayExit} in={this.state.in} timeout={500}>
				{state => (
					<div className='outer-container' style={{ ...defaultStyle, ...transitionStyles[state] }}>
						<div className='inner-container'>{alert}</div>
						<style jsx>{`
							.outer-container {
								width: 100%;
								min-height: 2em;
								background: ${color};
								display: flex;
								justify-content: center;
								align-items: center;
							}
							.inner-container {
								color: white;
								text-align: center;
							}
						`}</style>
					</div>
				)}
			</Transition>
		)
	}
}

NotificationBar.propTypes = {
	alert: PropTypes.string.isRequired,
	color: PropTypes.string.isRequired,
	onSetUserNotification: PropTypes.func.isRequired
}

export default NotificationBar
