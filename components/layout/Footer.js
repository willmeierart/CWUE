import PropTypes from 'prop-types'
import { Link } from 'next-url-prettifier'
import { Router, routes } from '../../server/routes'

const Footer = () => {
  const socials = [ { type: 'facebook', link: '' }, { type: 'twitter', link: '' } ]
  const renderSocialIcons = socials => socials.map(b => (
    <a key={b.type} href={b.link}>
      <i className={`fab fa-${b.type}`} />
      <style jsx>{`
        a {
          margin: 1em;
        }
      `}</style>
    </a>
  ))

  const appendChildList = route => {
    return (
      <div>
        <ul className='sub-list'>
          { route.children.map(child => (
            <li key={child.title}>
              <Link prefetch route={Router.linkPage(route.page, { title: child.title })}>
                <span>{ child.title }</span>
              </Link>
            </li>
          )) }
        </ul>
        <style jsx>{`
          .sub-list li {
            font-weight: normal;
          }
        `}</style>
      </div>
    )
  }
  const renderNav = routes => (
    <ul className='top-lvl-routes'>
      { routes.filter(route => route.page !== 'index' && route.page !== 'legal').map(route => (
        <li key={route.title}>
          <Link prefetch route={Router.linkPage(route.page, { title: route.title })}>
            <span>{ route.title }</span>
          </Link>
          { route.children && appendChildList(route) }
        </li>
      )) }
      <style jsx>{`
        li {
          line-height: 2em;
          cursor: pointer;
          border-left: 2px solid white;
          padding-left: 1.5vw;
        }
        .top-lvl-routes {
          display: flex;
          justify-content: space-around;
          width: 100%;
        }
        .top-lvl-routes li {
          font-weight: bold;
        }
      `}</style>
    </ul>
  )
  return (
    <div className='footer'>
      <div className='footer-content-wrapper'>
        <div className='socials-wrapper'>{ renderSocialIcons(socials) }</div>
        <div className='footer-nav-wrapper'>{ renderNav(routes) }</div>
      </div>
      <div className='copyright'>Copyright © 2018 ・ All Rights Reserved ・ Carwash USA Express </div>
      <style jsx>{`
        .footer {
          width: 100vw;
          border-top: 2px solid grey;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          position: relative;
          background: var(--color-red);
          color: white;
        }
        .footer-content-wrapper {
          position: relative;
          height: 100%;
          margin: 0 2em;
        }
        .footer-nav-wrapper {
          width: 80%;
          display: flex;
          justify-content: space-between;
          margin-left: 10vw;
          margin-top: 30px;
          margin-bottom: 100px;
        }
        .socials-wrapper {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex-grow: 1;
          height: 100%;
          width: 10vw;
          position: absolute;
          top: 0;
          left: 0;
        }
        .logo-wrapper {
          float: right;
          width: 50px;
          height: 50px;
          margin-bottom: 10px;
        }
        .copyright {
          width: 100%;
          text-align: center;
          position: absolute;
          bottom: 0;
        }
      `}</style>
    </div>
  )
}

Footer.propTypes = {

}

export default Footer
