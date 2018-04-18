import PropTypes from 'prop-types'
import ContactInfo from './ContactInfo'

const ContactModule = ({ type, section, contactInfo }) => {
  const { headerText, subheaderText, btnText } = section
  const header = headerText ? headerText.toUpperCase() : type.toUpperCase()
  return (
    <div className='outer-container'>
      <div className='inner-container'>
        <h2>{ header }</h2>
        <div className='subhead'>{ subheaderText }</div>
        { type === 'inquiries' && <ContactInfo info={contactInfo} small /> }
        { type === 'fundraising' &&
          <div>
            <div className='fundraising-copy'>
              <div>QUESTIONS? Email us:</div>
              <div>customerservice@carwashusaexpress.com</div>
            </div>
            <div className='fundraising-dl'>🔗 DOWNLOAD OUR FUNDRAISING FLYER</div>
          </div>
        }
        { btnText && <div className='btn'>{ btnText }</div> }
      </div>
      <style jsx>{`
        .outer-container {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          flex-grow: 1;
        }
        .inner-container {
          width: calc(100% - 2em);
          height: calc(100% - 2em);
          margin: 1em;
          padding: .5em;          
          border: 1px solid black;
          box-sizing: border-box;
          position: relative;
        }
        h2 {
          margin-top: 0;
        }
        .subhead {
          font-size: .75em;
          color: grey;
        }
        .btn {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          background: lightgrey;
          border-top: 1px solid black;
          text-align: center;
          padding: .5em;
          box-sizing: border-box;
        }
        .fundraising-copy {
          font-size: .75em;
          margin: .5em 0;
        }
        .fundraising-dl {
          font-size: .75em;
          color: grey;
        }
      `}</style>
    </div>
  )
}

ContactModule.propTypes = {
  type: PropTypes.string.isRequired,
  section: PropTypes.object.isRequired,
  contactInfo: PropTypes.object
}

export default ContactModule
