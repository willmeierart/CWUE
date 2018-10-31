// main wrapper component - layout, universal styles, etc.
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
	getVPDims,
	setUserNotification,
	checkIfMobile,
	openMobileMenu,
	checkIfIE,
	checkSWAvailable
} from '../lib/redux/actions'
import Header from './layout/Header'
import Footer from './layout/Footer'
import NotificationBar from './ui/NotificationBar'

// import globalStyles from '../../styles/index.scss'

class App extends Component {
	componentDidMount () {
		this.props.onCheckIfMobile()
		this.props.onCheckIfIE()
		this.props.onGetVPDims()
		this.props.onCheckSWAvailable()
		window.addEventListener('resize', () => {
			this.props.onGetVPDims()
			this.props.onCheckIfMobile()
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
		} = this.props
		// console.log(url)
		return (
			<div className='App'>
				{/* <Head title={title} /> */}
				<Header openMenu={onOpenMobileMenu} isMobile={isMobile} url={url} />
				{alert !== '' &&
				color !== '' && <NotificationBar onSetUserNotification={onSetUserNotification} alert={alert} color={color} />}
				<main>{children}</main>
				<Footer isMobile={isMobile} />
				<style jsx global>{`
					body {
						--color-red: #c73a37;
						--color-blue: #36659a;
						--color-darkgrey: #b0b0b0;
						--color-lightgrey: #f0f0f0;
						--font-body: 'Gotham Book', sans-serif;
						--font-header: 'Gotham', sans-serif;
						--font-prices: 'Monterrat', sans-serif;
						width: 100vw;
						height: 100%;
						padding: 0;
						margin: 0;
						font-family: sans-serif;
						overflow-x: hidden;
						overflow-y: ${menuOpen ? 'hidden' : 'scroll'};
						font-family: 'Gotham Book', sans-serif;
					}
					a {
						text-decoration: none;
						color: inherit;
					}
					ul,
					li {
						list-style: none;
						padding-left: 0;
						margin-left: 0;
						--webkit-padding-before: 0;
					}
					h1 {
						font-size: 4em;
						font: var(--font-header);
					}
					h2 {
						font-size: 2.25em;
						font: var(--font-header);
					}
					h3 {
						font-size: 1.25em;
						letter-spacing: .04em;
					}
					h4 {
						font-size: .83em;
						font: var(--font-header);
					}
				`}</style>
			</div>
		)
	}
}

function mapStateToProps (state) {
	return {
		vpDims: state.env.vpDims,
		userNotification: state.env.userNotification,
		isMobile: state.env.isMobile,
		menuOpen: state.env.menuOpen,
		isIE: state.env.isIE,
		swAvailable: state.env.swAvailable
	}
}

function mapDispatchToProps (dispatch) {
	return {
		onGetVPDims: () => dispatch(getVPDims()),
		onSetUserNotification: (alertObj) => dispatch(setUserNotification(alertObj)),
		onCheckIfMobile: () => dispatch(checkIfMobile()),
		onOpenMobileMenu: (bool) => dispatch(openMobileMenu(bool)),
		onCheckIfIE: (bool) => dispatch(checkIfIE(bool)),
		onCheckSWAvailable: () => dispatch(checkSWAvailable())
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

App.propTypes = {
	title: PropTypes.string.isRequired,
	vpDims: PropTypes.object.isRequired,
	userNotification: PropTypes.object.isRequired,
	onSetUserNotification: PropTypes.func.isRequired,
	isMobile: PropTypes.bool.isRequired,
	isIE: PropTypes.bool.isRequired,
	swAvailable: PropTypes.bool.isRequired,
	onOpenMobileMenu: PropTypes.func.isRequired,
	onCheckIfIE: PropTypes.func.isRequired,
	onCheckSWAvailable: PropTypes.func.isRequired
}
