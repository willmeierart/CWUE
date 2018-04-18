import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'next-url-prettifier'
import { Router, routes } from '../../server/routes'
import { binder } from '../../lib/_utils'

export default class TopMenu extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showWashSubList: false,
      showAboutSubList: false
    }
    binder(this, ['renderList', 'renderSubList'])
  }
  renderSubList (route) {
    return (
      route.children.map((child, i) => {
        const { title } = child
        const formattedTitle = title.toLowerCase().replace(' ', '-')
        return (
          <li key={i} className='child-route'>
            <Link prefetch route={Router.linkPage(route.page, { title: formattedTitle })}>
              <a>{ title }</a>
            </Link>
          </li>
        )
      })
    )
  }
  renderList () {
    const { onSetLocPageState, pageState } = this.props
    const { showAboutSubList, showWashSubList } = this.state
    return (
      <ul>
        {
          routes.map(route => {
            switch (route.title) {
              case ('Car Washes') :
                return (
                  <li key={route.title}
                    // onMouseOut={() => { this.setState({showWashSubList: false}) }}
                    onMouseOver={() => { this.setState({ showWashSubList: true }) }}>
                    <Link prefetch route={Router.linkPage(route.page, { title: route.title })}>
                      <a>{ route.title }</a>
                    </Link>
                    { showWashSubList &&
                      <ul className='sub-ul'>{ this.renderSubList(route) }</ul>
                    }
                  </li>
                )
              case ('Fast Pass - Unlimited') :
                return (
                  <li key={route.title}>
                    <Link prefetch route={Router.linkPage(route.page, { title: route.title })}>
                      <a>{ route.title }</a>
                    </Link>
                  </li>
                )
              case ('About') :
                return (
                  <li key={route.title}
                    // onMouseOut={() => { this.setState({showAboutSubList: false}) }}
                    onMouseOver={() => { this.setState({ showAboutSubList: true }) }}>
                    <Link prefetch route={Router.linkPage(route.page, { title: route.title })}>
                      <a>{ route.title }</a>
                    </Link>
                    { showAboutSubList &&
                      <ul className='sub-ul'>{ this.renderSubList(route) }</ul>
                    }
                  </li>
                )
              case 'Locations' :
                return (
                  <li key={route.title} onClick={() => { onSetLocPageState('initial') }}>
                    <Link prefetch route={Router.linkPage(route.page, { state: pageState })}>
                      <a className='locations'>FIND A LOCATION</a>
                    </Link>
                  </li>
                )
              case 'My Account' :
                {/* return (
                  <li key={route.title}>
                    <a href=''><span className='account'>{ route.title }</span></a>
                  </li>
                ) */}
                return null
              default :
                return null
            }
          })
        }
        <style jsx>{`
          ul {
            display: flex;
            font-size: .75em;
            {/* margin-left: 3em; */}
            justify-content: center;
            flex-grow: 0;
            position: fixed;
            width: 100%;
            left: 0;
          }
          .sub-ul {
            position: relative;
            flex-direction: column;
            margin: 0;
          }
          li {
            margin-right: 5em;
            white-space: nowrap;
            cursor: pointer;
          }
          .account {
            position: absolute;
            top: 5px;
            right: 5px;
            color: grey;
          }
          .locations {
            background-color: lightgrey;
            border: 1px solid black;
            border-radius: 5px;
            padding: .5em;
          }
        `}</style>
      </ul>
    )
  }

  render () {
    return (
      <div className='top-menu'>
        <div className='list-wrapper'>
          <div>{ this.renderList() }</div>
        </div>
        <style jsx>{`
          .top-menu {
            width: 100%;
          }
          .list-wrapper{
            width: ${this.props.url.pathname === '/' ? '100%' : 'calc(100% - 100px)'};
          }
        `}</style>
      </div>
    )
  }
}

TopMenu.propTypes = {
  pageState: PropTypes.string.isRequired,
  onSetLocPageState: PropTypes.func.isRequired,
  url: PropTypes.object.isRequired
}
