import React from 'react'
import PropTypes from 'prop-types'

const FooterLogos = ({ images }) => {
  const renderImages = images => (
    images.map(imgSrc => (
      <div key={imgSrc}>
        <img key={imgSrc} src={imgSrc} alt={imgSrc} />
        <style jsx>{`
          img {
            border: 1px solid black;
            border-radius: 5px;
          }
        `}</style>
      </div>
    ))
  )
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
        }
      `}</style>
    </div>
  )
}

FooterLogos.propTypes = {
  images: PropTypes.array.isRequired
}

export default FooterLogos
