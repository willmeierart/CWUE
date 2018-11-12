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
import Layout from './layout/Layout'

class AppWrapper extends Component {
	constructor (props) {
		super(props)
		this.state = { mainHeight: 0 }
	}
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
		return React.createElement(Layout, this.props, this.props.children)
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
