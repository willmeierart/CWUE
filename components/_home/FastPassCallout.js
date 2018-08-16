import { Link } from 'next-url-prettifier'
import { Router } from '../../server/routes'

const FastPassCallout = () => (
  <div className='callout'>
    <Link prefetch route={Router.linkPage('/fastpass', { title: 'fastpass' })}>
      <a><div className='box'>
        <div className='txt'>
          <div className='large'>GET YOUR</div>
          <div className='bold large'>FASTPASS</div>
          <div className='large'>AND GO</div>
          <div className='bold large'>UNLIMITED</div>
        </div>
        <div className='arrow'> (>) </div>
      </div></a>
    </Link>
    <style jsx>{`
      .callout {
        width: 25vw;
        height: 25vw;
        margin: 1.5vw;
        padding: 20px;
        box-sizing: border-box;
        background: var(--color-red);
      }
      .large {
        font-size: 3em;
      }
      .bold {
        font-weight: bold;
      }
      .txt, .arrow {
        color: white;
      }
      .arrow {
        margin-top: 1.5vw;
      }
      @media screen and (max-width: 1001px) {
        .callout {
          width: 47.75vw;
          height: 47.75vw;
          margin-right: 0;
        }
      }
    `}</style>
  </div>
)

export default FastPassCallout
