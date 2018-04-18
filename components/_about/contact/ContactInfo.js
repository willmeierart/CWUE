import PropTypes from 'prop-types'

const ContactInfo = ({ small, info }) => {
  return (
    <div className='outer-container'>
      <div>{ info.email }</div>
      <div>{ info.phone }</div>
      <div>{ info.addr1 }</div>
      <div>{ info.addr2 }</div>
      <style jsx>{`
        .outer-container {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          font-weight: ${small && 'bold'};
          font-size: ${small && '.5em'};
          margin-top: .75em;
          line-height: 1.5em;
        }
      `}</style>
    </div>
  )
}

ContactInfo.propTypes = {
  small: PropTypes.bool,
  info: PropTypes.object.isRequired
}

export default ContactInfo
