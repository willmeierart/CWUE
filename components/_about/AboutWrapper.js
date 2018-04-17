import React, { Component } from 'react'
import ExecutionEnvironment from 'exenv'
import { compose, graphql } from 'react-apollo'
import { aboutPage, pageCopy } from '../../lib/apollo/queries'
import PropTypes from 'prop-types'
import WithApolloLoader from '../hoc/WithApolloLoader'
import TopSubMenu from '../layout/TopSubMenu'
import TemplateSwitcher from './TemplateSwitcher'
import { binder } from '../../lib/_utils'

class AboutWrapper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      template: 'company' // company || testimonials || news || careers || faq || contact
    }
    binder(this, ['setPageStateViaUrl'])
  }
  componentDidMount () {
    this.setPageStateViaUrl()
  }

  componentDidUpdate (newProps) {
    if (newProps.url !== this.props.url) {
      this.setPageStateViaUrl()
    }
  }

  setPageStateViaUrl () {
    const { query: { title }, asPath, pathname } = this.props.url
    const splitPath = asPath.split(`${pathname}/`)
    const backupTitle = splitPath[splitPath.length - 1]
    this.setState({ template: title || backupTitle })
  }

  render () {
    const { url } = this.props
    const { template } = this.state
    return (
      <div className='outer-wrapper'>
        <TemplateSwitcher template={template} />
        <style jsx>{``}</style>
      </div>
    )
  }
}

AboutWrapper.propTypes = {

}

export default compose(
  graphql(aboutPage)
)(
  WithApolloLoader(AboutWrapper)
)
