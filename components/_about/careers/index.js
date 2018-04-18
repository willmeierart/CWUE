import PropTypes from 'prop-types'
import ApplyNowBtn from './ApplyNowBtn'
import BenefitsLayout from './BenefitsLayout'

const Careers = ({ benefits }) => {
  return (
    <div className='outer-container'>
      <div className='inner-container'>
        <h1>JOIN OUR TEAM</h1>
        <div className='subhead-copy'>Locavore chartreuse migas messenger bag DIY freegan. Gastropub banh mi gochujang poke butcher, normcore mlkshk hexagon XOXO. Distillery tofu af, chia umami letterpress ramps unicorn poutine swag craft beer neutra la croix kogi cliche. Mustache before they sold out meh la croix, organic fam selvage shoreditch pickled echo park succulents deep v butcher.</div>
        <ApplyNowBtn />
        <div className='benefits-wrapper'>
          <BenefitsLayout benefits={benefits} />
        </div>
      </div>
      <style jsx>{`
        .outer-container {}
        .inner-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .subhead-copy {
          width: 80%;
          font-size: .75em;
          color: grey;
          margin-bottom: 2em;
        }
      `}</style>
    </div>
  )
}

Careers.propTypes = {
  benefits: PropTypes.array.isRequired,
  data: PropTypes.object.isRequired
}

export default Careers
