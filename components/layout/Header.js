import TopMenu from './TopMenu'
import Logo from './Logo'

const Header = props => (
  <header className='header'>
    { props.url.pathname !== '/' && <Logo /> }
    {/* <div className='title'>CARWASH USA EXPRESS</div> */}
    <TopMenu {...props} />
    <style jsx>{`
      .header {
        position: absolute;
        top: 0;
        width: 100%;
        height: 120px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        z-index: 5;
      }
    `}</style>
  </header>
)

export default Header
