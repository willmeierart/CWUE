import PropTypes from 'prop-types'
import ImperativeRouter from '../../../../server/ImperativeRouter'

// used in both results and detail page

const ResultModule = ({ location, pickLocation, detail }) => {
  const { details, phone, addressStreet, addressCity, addressState, addressZip, openHours, name, brand } = location
  const addrLine2 = `${addressCity}, ${addressState}, ${addressZip}`
  const onPickLocation = () => {
    const query = { state: 'detail', spec: location.name }
    pickLocation(location)
    ImperativeRouter.push('locations', query, false)

    // if (pickLocation) setTimeout(() => { pickLocation(location) })
  }
  return location !== null ? (
    <div className='result-outer'>
      <div className='result-inner'>
        <h3>{ name }</h3>
        <h4>({ brand })</h4>
        <div className='details-container'>
          <div className='col col-left'>
            <div className='small-grey-1 addr-1'>{ addressStreet }</div>
            <div className='small-grey-1 addr-2'>{ addrLine2 }</div>
            <div className='phone'>{ phone }</div>
            <div className='small-grey-2 details'>{ details } </div>
          </div>
          <div className='col col-right'>
            <div className='hours'>HOURS</div>
            <div>{ openHours.map((hrs, i) => (
              <div key={`hrs-${i}`} className='mapped-hrs'>
                <div className='small-grey-2'>{ hrs.days }</div>
                <div className='small-grey-2'>{ hrs.time }</div>
              </div>
            )) }</div>
            { !detail &&
              <div className='visit-btn' onClick={onPickLocation}>
                {/* <Link prefetch route={Router.linkPage('locations', { state: 'detail', spec: location.name })}>
                  <a>VISIT LOCATION PAGE</a>
                </Link> */}
                <div>
                  VISIT LOCATION PAGE
                </div>
              </div>
            }
          </div>
        </div>
      </div>
      <style jsx>{`
        .result-inner {
          margin: 1em 0;
        }
        h3 {
          margin: 0;
          margin-bottom: .25em;
        }
        .details-container {
          display: flex;
          justify-content: space-between;
          position: relative;
          line-height: 1.25em;
        }
        .col1 {
          width: 69%;
        }
        .col2 {
          width: 39%;
        }
        .col {
          width: 49%;
        }
        .small-grey-1, .small-grey-2 {
          font-size: .75em;
          color: grey;
        }
        .small-grey-2 {
          font-size: .5em;
          line-height: 2em;
        }
        .hours {
          font-size: .7em;
        }
        .phone, .visit-btn {
          font-size: .85em;
        }
        .visit-btn {
          background-color: lightgrey;
          border: 2px solid grey;
          border-radius: 2px;
          text-align: center;
          font-size: .5em;
          cursor: pointer;
        }
        .mapped-hrs {
          display: flex;
          justify-content: space-between;
        }
      `}</style>
    </div>
  ) : null
}

ResultModule.propTypes = {
  location: PropTypes.object.isRequired,
  pickLocation: PropTypes.func,
  detail: PropTypes.bool
}

export default ResultModule
