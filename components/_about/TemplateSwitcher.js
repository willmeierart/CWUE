import PropTypes from 'prop-types'
import Company from './company'
import Testimonials from './testimonials'
import News from './news'
import Careers from './careers'
import FAQ from './faq'
import Contact from './contact'

const TemplateSwitcher = ({
  template,
  children,
  data,
  aboutData
}) => {
  const componentSwitcher = () => {
    switch (template) {
      case 'company':
        return (
          <Company data={data}>
            { children }
          </Company>
        )
      case 'testimonials':
        return (
          <Testimonials data={data}>
            { children }
          </Testimonials>
        )
      case 'news':
        return (
          <News data={data}>
            { children }
          </News>
        )
      case 'careers':
        return (
          <Careers benefits={aboutData.benefits} data={data}>
            { children }
          </Careers>
        )
      case 'faq':
        return (
          <FAQ data={data}>
            { children }
          </FAQ>
        )
      case 'contact':
        return (
          <Contact contactInfo={aboutData.contactInfo}
            sections={aboutData.contactSections} data={data}>
            { children }
          </Contact>
        )
      default :
        return (
          <Company data={data}>
            { children }
          </Company>
        )
    }
  }
  return componentSwitcher()
}

TemplateSwitcher.propTypes = {
  template: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  aboutData: PropTypes.object.isRequired
}

export default TemplateSwitcher
