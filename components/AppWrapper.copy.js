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
	checkSWAvailable,
	setLoadingStatus
} from '../lib/redux/actions'
import Header from './layout/Header'
import Footer from './layout/Footer'
import NotificationBar from './ui/NotificationBar'
import Loader from 'react-loader'

class AppWrapper extends Component {
	constructor (props) {
		super(props)
		this.state = { mainHeight: 0 }
		this.header = React.createRef()
		this.footer = React.createRef()
	}
	componentDidMount () {
		this.props.onCheckIfMobile()
		this.props.onCheckIfIE()
		this.props.onGetVPDims()
		this.props.onCheckSWAvailable()
		window.addEventListener('resize', () => {
			this.props.onGetVPDims()
			this.props.onCheckIfMobile()
			this.setMainHeight()
		})
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
		// console.log(url)
		return (
			<div className='AppWrapper'>
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

function mapStateToProps (state) {
	return {
		vpDims: state.env.vpDims,
		userNotification: state.env.userNotification,
		isMobile: state.env.isMobile,
		menuOpen: state.env.menuOpen,
		isIE: state.env.isIE,
		swAvailable: state.env.swAvailable,
		isLoading: state.env.isLoading
	}
}

function mapDispatchToProps (dispatch) {
	return {
		onGetVPDims: () => dispatch(getVPDims()),
		onSetUserNotification: alertObj => dispatch(setUserNotification(alertObj)),
		onCheckIfMobile: () => dispatch(checkIfMobile()),
		onOpenMobileMenu: bool => dispatch(openMobileMenu(bool)),
		onCheckIfIE: bool => dispatch(checkIfIE(bool)),
		onCheckSWAvailable: () => dispatch(checkSWAvailable()),
		onSetLoadingStatus: bool => dispatch(setLoadingStatus(bool))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AppWrapper)

AppWrapper.propTypes = {
	title: PropTypes.string.isRequired,
	vpDims: PropTypes.object.isRequired,
	userNotification: PropTypes.object.isRequired,
	onSetUserNotification: PropTypes.func.isRequired,
	isMobile: PropTypes.bool.isRequired,
	isIE: PropTypes.bool.isRequired,
	swAvailable: PropTypes.bool.isRequired,
	onOpenMobileMenu: PropTypes.func.isRequired,
	onCheckIfIE: PropTypes.func.isRequired,
	onCheckSWAvailable: PropTypes.func.isRequired,
	onSetLoadingStatus: PropTypes.func.isRequired
}
