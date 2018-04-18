import PropTypes from 'prop-types'
import Link from 'next/link'

const Logo = ({ isHomepage }) => (
  <Link href='/'><a>
    <div className='logo-wrapper'>
      <img src='/static/images/CWUE_logo.png' alt='logo' />
      <style jsx>{`
        .logo-wrapper {
          margin: 0.5em;
          border-radius: 5px;
          width: ${isHomepage ? '20vw' : '100px'};
          height: ${isHomepage ? '20vw' : '100px'};;
          display: flex;
          justify-content: center;
          align-items: center;
          position:relative;
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
