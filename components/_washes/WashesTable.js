import PropTypes from 'prop-types'
import washData from '../../lib/_data/washData'
import WashItem from './WashItem'

const WashesTable = ({ type }) => {
  const renderTable = () => {
    const typeKey = type.split('-')[0]
    const thisWashData = washData[typeKey]
    return thisWashData.map((wash, i) => (
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

export default WashesTable
