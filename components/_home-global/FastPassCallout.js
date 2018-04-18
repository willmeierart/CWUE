import PropTypes from 'prop-types'
import { Link } from 'next-url-prettifier'
import { Router, routes } from '../../server/routes'

const FastPassCallout = () => (
  <div className='outer-wrapper'>
    <Link prefetch route={Router.linkPage('fastpass', {})}>
      <a className='inner-wrapper'>
        <div>GET YOUR</div>
        <div className='big-bold'>FAST PASS</div>
        <div>AND GO UNLIMITED</div>
      </a>
    </Link>
    <style jsx>{`
      .outer-wrapper {
        display: flex;
        justify-content: center;
      }
      .inner-wrapper {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 30vw;
        padding: 1em;
        border: 1px solid black;
        background: white;        
      }
      .big-bold {
        font-weight: bold;
        font-size: 3em;
      }
    `}</style>
  </div>
)

export default FastPassCallout
