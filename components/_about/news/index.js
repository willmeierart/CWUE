import PropTypes from 'prop-types'
import Blog from './Blog'

const News = props => {
  return (
    <div className='outer-container'>
      <div className='inner-container'>
        <Blog />
      </div>
      <style jsx>{`
        .outer-container {}
        .inner-container {}
      `}</style>
    </div>
  )
}

News.propTypes = {
  data: PropTypes.object.isRequired
}

export default News
