import PropTypes from 'prop-types'
import ResultModule from './ResultModule'

const ResultsList = ({ results, pickLocation }) => {
  const renderResults = () => {
    if (results && results.length > 0) {
      return results.map((location, i) => (
        <div key={`result-${i}`}>
          <ResultModule pickLocation={pickLocation} location={location} />
          { i !== results.length - 1 && <hr /> }
        </div>
      ))
    } else {
      return null
    }
  }
  return (
    <div className='outer-container'>
      <div className='inner-container'>
        { renderResults() }
      </div>
      <style jsx>{`
        .outer-container, .inner-container {
          width: 100%;
        }
      `}</style>
    </div>
  )
}

ResultsList.propTypes = {
  results: PropTypes.array.isRequired,
  pickLocation: PropTypes.func.isRequired
}

export default ResultsList
