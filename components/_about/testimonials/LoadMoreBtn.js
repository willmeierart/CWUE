import PropTypes from 'prop-types'

const LoadMoreBtn = ({ handleClick }) => {
  return (
    <div className='outer-container'>
      <div className='inner-container' onClick={handleClick}>Load More Testimonials</div>
      <style jsx>{`
        .outer-container {
          display: flex;
          justify-content: center;
          margin-top: 2em;
        }
        .inner-container {
          width: 300px;
          border: 1px solid black;
          border-radius: 5px;
          background: lightgrey;
          text-align: center;
          padding: .25em;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

LoadMoreBtn.propTypes = {}

export default LoadMoreBtn
