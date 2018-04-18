import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Testimonial from './Testimonial'
import LoadMoreBtn from './LoadMoreBtn'

export default class Testimonials extends Component {
  constructor (props) {
    super(props)
    this.state = { showThru: 6 }
    this.incrementShowThru = this.incrementShowThru.bind(this)
  }

  incrementShowThru () {
    this.setState({ showThru: this.state.showThru + 6 })
  }

  render () {
    const testimonials = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    const renderTestimonialList = testimonials.map((t, i) =>
      <Testimonial key={i} l={i % 2 === 0} />
    )
    const sliceEnd = testimonials.length + 1
    const showVal = this.state.showThru <= sliceEnd ? this.state.showThru : sliceEnd

    return (
      <div className='outer-container'>
        <div className='inner-container'>
          <h1>WE LOVE YOU TOO!</h1>
          <div className='testimonial-list-wrapper'>
            { renderTestimonialList.slice(0, showVal) }
          </div>
          { showVal !== sliceEnd &&
            <div className='show-btn-wrapper'>
              <LoadMoreBtn handleClick={this.incrementShowThru} />
            </div>
          }
        </div>
        <style jsx>{`
          .outer-container {}
          .inner-container {
            padding: 2vw;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
          }
          h1 {
            margin-top: 0;
          }
          .testimonial-list-wrapper {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: stretch;
          }
        `}</style>
      </div>
    )
  }
}

Testimonials.propTypes = {
  data: PropTypes.object.isRequired
}
