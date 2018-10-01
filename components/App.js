// main wrapper component - layout, universal styles, etc.
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setLocPageState, getVPDims, setUserNotification, checkIfMobile, openMobileMenu } from '../lib/redux/actions'
import Header from './layout/Header'
import Footer from './layout/Footer'
import NotificationBar from './ui/NotificationBar'

// import globalStyles from '../../styles/index.scss'

class App extends Component {
  componentDidMount () {
    this.props.onCheckIfMobile()
    window.addEventListener('resize', () => {
      this.props.onGetVPDims()

      this.props.onCheckIfMobile()
    })
  }
  render () {
    const { title, children, pageState, onSetLocPageState, url, userNotification: { alert, color }, onSetUserNotification, isMobile, onOpenMobileMenu, menuOpen } = this.props
    // console.log(url)
    return (
      <div className='App'>
        {/* <Head title={title} /> */}
        <Header openMenu={onOpenMobileMenu} isMobile={isMobile} url={url} pageState={pageState} onSetLocPageState={onSetLocPageState} />
        { (alert !== '' && color !== '') && <NotificationBar onSetUserNotification={onSetUserNotification} alert={alert} color={color} /> }
        <main>{ children }</main>
        <Footer isMobile={isMobile} pageState={pageState} />
        <style jsx global>{`
          body {
            --color-red: #C73A37;
            --color-blue: #36659A;
            --color-darkgrey: #B0B0B0;
            --color-lightgrey: #F0F0F0;
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
          ul, li {
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
            letter-spacing: .4em;
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
    pageState: state.location.pageState,
    vpDims: state.env.vpDims,
    userNotification: state.env.userNotification,
    isMobile: state.env.isMobile,
    menuOpen: state.env.menuOpen
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onSetLocPageState: pageState => dispatch(setLocPageState(pageState)),
    onGetVPDims: () => dispatch(getVPDims()),
    onSetUserNotification: alertObj => dispatch(setUserNotification(alertObj)),
    onCheckIfMobile: () => dispatch(checkIfMobile()),
    onOpenMobileMenu: bool => dispatch(openMobileMenu(bool))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

App.propTypes = {
  pageState: PropTypes.string.isRequired,
  onSetLocPageState: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  vpDims: PropTypes.object.isRequired,
  userNotification: PropTypes.object.isRequired,
  onSetUserNotification: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  onOpenMobileMenu: PropTypes.func.isRequired
}
