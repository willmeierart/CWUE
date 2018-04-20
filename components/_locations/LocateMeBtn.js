import PropTypes from 'prop-types'
import ImperativeRouter from '../../server/ImperativeRouter'

const LocateMeBtn = ({ onMakeUserLocationPage }) => {
  const handleClick = () => {
    ImperativeRouter.push('locations', { state: 'results', spec: 'my-location' }, false)
    onMakeUserLocationPage(true)
  } 
  return (
    <div className='outer-container'>
      <div onClick={handleClick} className='inner-container'>Find a Location Near Me!</div>
      <style jsx>{`
        .outer-container {
          cursor: pointer;
        }
        .inner-container {
          padding: 1em;
          border: 1px solid black;
          border-radius: 5px;
          background: lightgrey;
        }
      `}</style>
    </div>
  )
}

LocateMeBtn.propTypes = {
  onMakeUserLocationPage: PropTypes.func.isRequired
}

export default LocateMeBtn
