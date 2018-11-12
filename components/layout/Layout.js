// main wrapper component - layout, universal styles, etc.
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Header from './Header'
import Footer from './Footer'
import NotificationBar from '../ui/NotificationBar'
// import Loader from 'react-loader'

export default class Layout extends Component {
	constructor (props) {
		super(props)
		this.state = { mainHeight: 0 }
		this.header = React.createRef()
		this.footer = React.createRef()
	}

	componentDidMount () {
		window.addEventListener('resize', this.setMainHeight)
	}

	componentDidUpdate (prevProps, prevState) {
		if (this.header && this.footer && prevState.mainHeight === 0) {
			this.setMainHeight()
		}
	}

	setMainHeight = () => {
		this.setState({
			mainHeight:
				this.header.current.getBoundingClientRect().height + this.footer.current.getBoundingClientRect().height
		})
	}

	render () {
		const {
			children,
			url,
			userNotification: { alert, color },
			onSetUserNotification,
			isMobile,
			onOpenMobileMenu,
			menuOpen
			// isLoading
		} = this.props
		return (
			<div className='Layout'>
				<header ref={this.header}>
					<Header openMenu={onOpenMobileMenu} isMobile={isMobile} url={url} />
				</header>
				{alert !== '' &&
				color !== '' && <NotificationBar onSetUserNotification={onSetUserNotification} alert={alert} color={color} />}
				<main className='main-content-height'>{children}</main>
				<footer ref={this.footer}>
					<Footer isMobile={isMobile} />
				</footer>
				<style jsx global>{`
					body {
						overflow-y: ${menuOpen ? 'hidden' : 'scroll'};
					}
					.main-content-height {
						min-height: calc(100vh - ${this.state.mainHeight}px);
					}
				`}</style>
			</div>
		)
	}
}

Layout.propTypes = {
	userNotification: PropTypes.object.isRequired,
	onSetUserNotification: PropTypes.func.isRequired,
	isMobile: PropTypes.bool.isRequired,
	onOpenMobileMenu: PropTypes.func.isRequired
}
