import PropTypes from 'prop-types'
import FAQitem from './FAQItem'

const FAQ = props => {
  const FAQs = [0, 0, 0, 0, 0, 0]
  const renderFAQlist = FAQs.map((faq, i) =>
    <FAQitem key={i} />
  )
  return (
    <div className='outer-container'>
      <div className='inner-container'>{ renderFAQlist }</div>
      <style jsx>{`
        .outer-container {}
        .inner-container {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
        }
      `}</style>
    </div>
  )
}

FAQ.propTypes = {
  data: PropTypes.object.isRequired
}

export default FAQ
