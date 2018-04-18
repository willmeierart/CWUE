import PropTypes from 'prop-types'
import washData from '../../lib/_data/washData'
import WashItem from './WashItem'

const WashesTable = ({ data }) => {
  const renderTable = () => {
    return data.map((wash, i) => (
      <div key={i} className='item-wrapper'>
        <WashItem wash={wash} />
        <style jsx>{`
          .item-wrapper {
            width: 100%;
            margin: 0 .5em;
          }
        `}</style>
      </div>
    ))
  }
  return (
    <div className='outer-wrapper'>
      { renderTable() }
      <style jsx>{`
        .outer-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: stretch;
        }
      `}</style>
    </div>
  )
}

WashesTable.propTypes = {
  data: PropTypes.array.isRequired
}

export default WashesTable
