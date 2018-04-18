import PropTypes from 'prop-types'

const Company = ({ data }) => {
  const bodyCopy = data.allPageCopies[0].aboutPageCopy
  const headerCopy = data.allAboutPages[0].aboutPageSections.headerText
  return (
    <div className='outer-container'>
      <div className='inner-container'>
        <h1>{ headerCopy.toUpperCase() }</h1>
        <div className='copy'>{ bodyCopy }</div>
      </div>
      <style jsx>{`
        .outer-container {}
        .inner-container {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
        }
        .copy {
          width: 80%;
          margin-top: 2em;
        }
      `}</style>
    </div>
  )
}

Company.propTypes = {
  data: PropTypes.object.isRequired
}

export default Company
