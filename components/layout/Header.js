import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TopMenu from './TopMenu'
import Logo from './Logo'
import MobileMenu from './MobileMenu'
import MobileNavBtn from './MobileNavBtn'
import  { ProfileIcon } from '../assets/SVG'
import { binder } from '../../lib/_utils'

class Header extends Component {
  constructor (props) {
    super(props)
    this.state = {
      menuOpen: false
    }
    binder(this, ['handleClick'])
  }

  handleClick (close) {
    if (close) {
      this.setState({ menuOpen: false })
      this.props.openMenu(false)
    } else {
      this.setState({ menuOpen: !this.state.menuOpen }, () => {
        this.props.openMenu(this.state.menuOpen)
      })
    }
  }

  render () {
    return (
      <header className='header'>
        <Logo />
        { this.props.isMobile
          ? <div>
            
            <MobileNavBtn handleClick={() => { this.handleClick() }} menuOpen={this.state.menuOpen} />
            <div className='menu-wrapper'>{ this.state.menuOpen && <MobileMenu closeMenu={() => { this.handleClick(true) }} /> }</div>
          </div>
          : <TopMenu {...this.props} />
        }
        <style jsx>{`
          .header {
            width: 100%;
            display: flex;
            align-items: center;
            z-index: 100;
            margin-bottom: -1.5em;
            position: relative;
            background-color: white;
          }
          .menu-wrapper {
            position: absolute;
            top: 100%;
            left: 0;
          }
        `}</style>
      </header>
    )
  }
}

Header.propTypes = {
  url: PropTypes.object.isRequired,
  pageState: PropTypes.string.isRequired,
  onSetLocPageState: PropTypes.func.isRequired
}

export default Header
