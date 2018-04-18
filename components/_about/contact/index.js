import PropTypes from 'prop-types'
import ContactModule from './ContactModule'

const Contact = ({ contactInfo, sections, data }) => {
  return (
    <div className='outer-container'>
      <div className='inner-container'>
        <div className='grid-wrapper a'>
          <ContactModule type='inquiries' contactInfo={contactInfo} section={sections.inquiries} />
        </div>
        <div className='grid-wrapper b'>
          <ContactModule type='feedback' section={sections.feedback} />
        </div>
        <div className='grid-wrapper c'>
          <ContactModule type='careers' section={sections.careers} />
        </div>
        <div className='grid-wrapper d'>
          <ContactModule type='fundraising' section={sections.fundraising} />
        </div>
      </div>
      <style jsx>{`
        .outer-container {
          display: flex;
          position: relative;
          width: 100vw;
        }
        .inner-container {
          display: grid;
          grid-template-areas: 'ab' 'cd';
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          width: 100%;
          height: 100%;
        }
        .grid-wrapper .a {
          grid-area: a;
          width: 100%;
          height: 100%;
        }
        .grid-wrapper .b {
          grid-area: b;
          width: 100%;
          height: 100%;
        }
        .grid-wrapper .c {
          grid-area: c;
          width: 100%;
          height: 100%;
        }
        .grid-wrapper .d {
          grid-area: d;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  )
}

Contact.propTypes = {
  sections: PropTypes.object.isRequired,
  contactInfo: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
}

export default Contact
