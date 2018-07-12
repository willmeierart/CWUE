// main wrapper component - layout, universal styles, etc.
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setLocPageState, getVPDims, setUserNotification } from '../lib/redux/actions'
import Header from './layout/Header'
import Footer from './layout/Footer'
import NotificationBar from './ui/NotificationBar'

// import globalStyles from '../../styles/index.scss'

class App extends Component {
  componentDidMount () {
    window.addEventListener('resize', this.props.onGetVPDims)
  }
  render () {
    const { title, children, pageState, onSetLocPageState, url, userNotification: { alert, color }, onSetUserNotification } = this.props
    // console.log(url)
    return (
      <div className='App'>
        {/* <Head title={title} /> */}
        <div>
          <Header url={url} pageState={pageState} onSetLocPageState={onSetLocPageState} />
          { (alert !== '' && color !== '') && <NotificationBar onSetUserNotification={onSetUserNotification} alert={alert} color={color} /> }
          <main>{ children }</main>
          <Footer pageState={pageState} />
        </div>
        <style jsx global>{`
          body {
            width: 100%;
            height: 100%;
            padding: 0;
            margin: 0;
            font-family: sans-serif;
          }
          main {
            min-height: 80vh;
            margin-top: 120px;
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
        `}</style>
        {/* <style dangerouslySetInnerHTML={{ __html: globalStyles }} /> */}
      </div>
    )
  }
} 

function mapStateToProps (state) {
  return {
    pageState: state.location.pageState,
    vpDims: state.env.vpDims,
    userNotification: state.env.userNotification
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onSetLocPageState: pageState => dispatch(setLocPageState(pageState)),
    onGetVPDims: () => dispatch(getVPDims()),
    onSetUserNotification: alertObj => dispatch(setUserNotification(alertObj))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

App.propTypes = {
  pageState: PropTypes.string.isRequired,
  onSetLocPageState: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  vpDims: PropTypes.object.isRequired,
  userNotification: PropTypes.object.isRequired,
  onSetUserNotification: PropTypes.func.isRequired
}
