import React from 'react'
import PropTypes from 'prop-types'

const BrandLogos = ({ images }) => {
  const renderImages = images => {
    const size = '25vw'
    const transformer = i => {
      switch (i) {
        case 0:
          return `translate3d(0, -${size}, 0)`
        case 1:
          return `translate3d(${size}, 0, 0)`
        case 2:
          return `translate3d(0, ${size}, 0)`
        case 3:
          return `translate3d(-${size}, 0, 0)`
        default:
          return ''
      }
    }
    return images.map((imgSrc, i) => (
      <div key={imgSrc}>
        <img key={imgSrc} src={imgSrc} alt={imgSrc} />
        <style jsx>{`
          @media screen and (max-width: 1001px) {
            div {
              position: absolute;
              // position: ${i !== images.length - 1 && 'absolute'};
              // bottom: 0;
              transform: ${transformer(i)};
            }
          }
        `}</style>
      </div>
    ))
  }
  return (
    <div className='outer-wrapper'>
      <div className='inner-wrapper'>
        { renderImages(images) }
      </div>
      <style jsx>{`
        .outer-wrapper {
          width: 100%;
          position: relative;
          margin-top: 2em;
          display: flex;
          justify-content: center;
        }
        .inner-wrapper {
          width: 90%;
          display: flex;
          justify-content: space-around;
          align-items: center;
        }
      `}</style>
    </div>
  )
}

BrandLogos.propTypes = {
  images: PropTypes.array.isRequired
}

export default BrandLogos
