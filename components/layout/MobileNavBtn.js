const MobileNavBtn = ({ handleClick, menuOpen }) => {
  return (
    <div className='nav-btn-wrapper'>
      <div className={`show-nav-btn ${menuOpen && 'open'}`} onClick={handleClick}>
        <span className='line a' />
        <span className='line b' />
        <span className='line c' />
        <span className='line d' />
      </div>
      <style jsx>{`
        .nav-btn-wrapper {
            position: absolute;
            width: 30px;
            height: 21px;
            right: 50px;
            top: 50px;
            cursor: pointer;
            z-index: 10000;            
          }
          .show-nav-btn {
            width: 100%;
            height: 100%;
            position: relative;
            z-index: 10000;                        
          }
          .line {
            display: block;
            position: absolute;
            left: 0;
            width: 100%;
            height: 3px;
            background-color: var(--color-red);
            transform: rotate(0deg);
            transition: .25s transform ease-in-out;
            z-index: 10000;            
            
          }
          .line.a {
            top: 0px;
          }
          .line.b, .line.c {
            top: 7px;
          }
          .line.d {
            top: 14px;
          }
          .open .a, .open .d {
            top: 4px;
            left: 50%;
            width: 0%;
          }
          .open .b {
            transform: rotate(45deg);
          }
          .open .c {
            transform: rotate(-45deg);
          }
      `}</style>
    </div>
  )
}

export default MobileNavBtn
