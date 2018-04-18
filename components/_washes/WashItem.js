import PropTypes from 'prop-types'

const WashItem = ({ wash }) => {
  const { title, priceReg, priceBulk, features } = wash
  const renderFeatureList = features.map((feature, i) => (
    <li style={{ fontSize: '.66em' }} key={i}>{ feature }</li>
  ))
  const bulkQty = 4
  const bulkPrice = bulkQty * priceBulk
  const savings = (bulkQty * priceReg) - bulkPrice
  return (
    <div className='outer-container'>
      <div className='inner-container'>
        <h3>{ title.toUpperCase() }</h3>
        <div className='main-container'>
          <div className='price-main'>
            <div className='big-number'> ${priceReg.toFixed(0)} </div>
            <div className='per-wash'>PER WASH</div>
          </div>
          <div className='feature-list'>
            <ul>{ renderFeatureList }</ul>
          </div>
        </div>
        <div className='price-bulk'>
          <div className='big-number-bulk'>{ bulkQty }</div>
          <div className='washes-for'>WASHES FOR</div>
          <div className='bulk-price-savings'>
            <div className='dollasign'>$</div>
            <div className='bulk-number'>{ bulkPrice }</div>
            <div className='savings'>Save ${ savings }</div>
          </div>
        </div>
        <a href='#' className='purchase-btn'>PURCHASE WASH PACK</a>
      </div>
      <style jsx>{`
        .outer-container {
          text-align: right;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: stretch;
          flex-grow: 1;
        }
        .inner-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        h3 {
          margin-bottom: 0;
        }
        .main-container {
          border: 1px solid black;
          padding: .5em;
          display: flex;
          flex-direction: column;
          justify-content: stretch;
          align-items: stretch;
          flex-grow: 1;
        }
        .big-number {
          font-size: 4em;
          font-weight: bold;
          color: grey;
        }
        .per-wash {
          font-size: .75em;
        }
        .price-bulk {
          border: 1px solid black;
          display: flex;
          justify-content: space-around;
          align-items: center;
        }
        .price-bulk > div {
          box-sizing: border-box;
          padding: 0 .1em;
        }
        .big-number-bulk {
          color: black;
          font-size: 4em;
          font-weight: bold;
        }
        .bulk-price-savings {
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .washes-for {
          font-size: .8em;
          flex-grow: 0;
        }
        .dollasign {
          position: absolute;
          top: .5em;
          left: .5em;
        }
        .dollasign, .savings {
          font-weight: bold;
          flex-wrap: nowrap;
          white-space: nowrap;
        }
        .bulk-number {
          font-weight: bold;
          font-size: 2.5em;
        }
        .purchase-btn {
          width: calc(100% - .2em);
          background: lightgrey;
          border: 1px solid black;
          border-radius: 5px;
          font-size: .8em;
          padding: .25em;
          margin: .1em;
          text-align: center;
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}

WashItem.propTypes = {
  wash: PropTypes.object.isRequired
}

export default WashItem
