import { Link } from 'next-url-prettifier'
import { Router } from '../../server/routes'
import BrandLogos from '../layout/BrandLogos'

const BrandLogosImage = () => (
  <div className='outer-wrapper'>
    <div className='top-copy'>OUR FAMILY OF CAR WASH BRANDS</div>
    <div className='breaker' />
    <div className='inner-wrapper'>
      <BrandLogos images={[
        'http://via.placeholder.com/120x120?text=CWUE',
        'http://via.placeholder.com/120x120?text=CWE',
        'http://via.placeholder.com/120x120?text=Goo+Goo',
        'http://via.placeholder.com/120x120?text=Supersonic',
        'http://via.placeholder.com/120x120?text=Splish+Splash'
      ]} />
    </div>
    <style jsx>{`
      .outer-wrapper {
        height: 25vw;
        width: 100vw;
        background: var(--color-blue);
        margin-bottom: 1.5vw;
        position: relative;
      }
      .top-copy {
        width: 100%;
        text-align: center;
        color: white;
        letter-spacing: .125em;
        margin-top: 1em;
      }
      .breaker {
        margin: 0 auto;
        margin-top: 1em;
        height: 1px;
        background: white;
        width: 3em;
      }
      .inner-wrapper {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      @media screen and (max-width: 1001px) {
        .outer-wrapper {
          height: 100vw;
        }
      }
    `}</style>
  </div>
)

export default BrandLogosImage
