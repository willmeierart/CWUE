import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { binder } from '../../lib/_utils'

class Images extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeImg: ''
    }
    binder(this, ['renderThumbs', 'selectImg'])
  }

  componentDidMount () {
    this.setState({ activeImg: this.props.images[0] })
  }

  renderThumbs () {
    let i = 0
    return (
      <div className='thumbs-array'>
        { this.props.images.reduce((a, b) => {
          if (b !== this.state.activeImg) {
            a.push(
              <div key={i} className='thumb-wrapper'>
                <img src={b} onClick={() => { this.selectImg(b) }} /> 
              </div>
            )
          }
          i++
          return a
        }, []) }
        <style jsx>{`
          img {
            border: 1px solid black;
            height: 100%;
            cursor: pointer;
          }
          .thumb-wrapper {
            height: 100%; 
            width: 100%;       
            position: relative;
            display: flex;
            justify-content: center;
          }
          .thumbs-array {
            width: 100%;
            height: 100%;
            position: absolute;
            display: flex;
            justify-content: flex-end;
          }
        `}</style>
      </div>
    )
  }

  selectImg (img) { this.setState({ activeImg: img }) }

  render () {
    return (
      <div className='image-outer'>
        <div className='main-img-wrapper'>
          <img src={this.state.activeImg} />
          <div className='thumb-row-wrapper'>
            <div className='thumbs-inner'>{ this.renderThumbs() }</div>
          </div>
        </div>
        <style jsx>{`
          .main-img-wrapper {
            width: 45vw;
            position: relative
          }
          img {
            width: 100%;
            border: 1px solid black;
          }
          .thumb-row-wrapper {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 20%;
          }
          .thumbs-inner {
            width: 100%;
            height: 80%;
            position: relative;
          }
        `}</style>
      </div>
    )
  }
}

Images.propTypes = {
  images: PropTypes.array.isRequired
}

export default Images
