// main wrapper component - layout, universal styles, etc.
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setLocPageState, getVPDims } from '../lib/redux/actions'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

// import globalStyles from '../../styles/index.scss'

class App extends Component {
  componentDidMount () {
    window.addEventListener('resize', this.props.onGetVPDims)
    console.log(this.props)
  }
  render () {
    const { title, children, pageState, onSetLocPageState, url } = this.props
    return (
      <div className='App'>
        {/* <Head title={title} /> */}
        <div>
          <Header url={url} pageState={pageState} onSetLocPageState={onSetLocPageState} />
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
    vpDims: state.env.vpDims
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onSetLocPageState: pageState => dispatch(setLocPageState(pageState)),
    onGetVPDims: () => dispatch(getVPDims())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

App.propTypes = {
  pageState: PropTypes.string.isRequired,
  onSetLocPageState: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  vpDims: PropTypes.object.isRequired
}
