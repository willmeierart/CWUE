import PropTypes from 'prop-types'

const BenefitModule = ({ icon, copy }) => {
  return (
    <div className='outer-container'>
      <div className='inner-container'>
        <div className='icon'>{ icon }</div>
        <div className='copy'>{ copy }</div>
      </div>
      <style jsx>{`
        .outer-container {
          width: 33vw;
        }
        .inner-container {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3em;
        }
        .icon {
          width: 50px;
          height: 50px;
          border: 1px solid black;
          border-radius: 5px;
          background: lightgrey;
          margin-bottom: 1em;
        }
        .copy {
          font-weight: bold;
          font-size: 1.25em;
        }
      `}</style>
    </div>
  )
}

BenefitModule.propTypes = {
  icon: PropTypes.string.isRequired,
  copy: PropTypes.string.isRequired
}

export default BenefitModule
