import PropTypes from 'prop-types'
import BenefitModule from './BenefitModule'

const BenefitsLayout = ({ benefits }) => {
  const renderBenefits = benefits.map((b, i) =>
    <BenefitModule key={i} copy={b.copy} icon={b.icon} />
  )
  return (
    <div className='outer-container'>
      <div className='inner-container'>{ renderBenefits }</div>
      <style jsx>{`
        .outer-container {
          margin-top: 100px;
        }
        .inner-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
        }
      `}</style>
    </div>
  )
}

BenefitsLayout.propTypes = {
  benefits: PropTypes.array.isRequired
}

export default BenefitsLayout
