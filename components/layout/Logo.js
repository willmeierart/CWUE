import PropTypes from 'prop-types'
import Link from 'next/link'

const Logo = props => (
  <Link href='/'><a>
    <div className='logo-wrapper'>
      <img src='/static/images/logo.png' alt='logo' />
      <style jsx>{`
        .logo-wrapper {
          margin: 3vw;
          margin-right: 0;
          width: 22vw;
          height: 8vw;
          display: flex;
          justify-content: center;
          align-items: center;
          position:relative;
          // background: var(--color-blue);
        }
        img {
          height: 100%;
        }
        h1 {
          padding: 0;
          margin: 0;
        }
      `}</style>
    </div>
  </a></Link>
)

Logo.propTypes = {
  isHomepage: PropTypes.bool
}

export default Logo
