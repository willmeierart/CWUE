import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Images from '../Images'
import ResultModule from './Results/ResultModule'
import { binder } from '../../../lib/_utils'
import ImperativeRouter from '../../../server/ImperativeRouter'


class Detail extends Component {
  constructor (props) {
    super(props)
    binder(this, ['renderSpecials'])
  }

  componentWillMount () {
    // console.log(this.props)
    console.log('detailwillmount')
    if (!this.props.activeLocation || this.props.activeLocation === {}) {
      console.log('THERE IS NO ACTIVE LOCATION')
      ImperativeRouter.push('locations', { state: 'initial' }, true)
      this.props.onSetLocPageState('initial')
    }
  }

  renderSpecials (specials) {
    return (
      <div className='specials-img-array'>
        { specials.map((special, i) => {
          return (
            <div key={`special-${i}`} className='special-img-wrapper'>
              <img alt={'special' + i} src={special} />
            </div>
          )
        }) }
        <style jsx>{`
          .specials-img-array {
            display: flex;
            justify-content: space-around;
          }
          .special-img-wrapper {
            position: relative;
            width: ${100 / (specials.length + 1)}%;
          }
          img {
            width: 100%;
            border: 1px solid black;
          }
        `}</style>
      </div>
    )
  }
  render () {
    const { children, activeLocation } = this.props
    console.log(activeLocation)
    const Title = children[0]
    const Map = children[2]
    return (
      <div className='template-wrapper'>
        { Title }
        <section className='main-content-wrapper'>
          <div className='top-content'>
            <div className='gridsec description-wrapper'>
              { activeLocation && activeLocation !== {} && <ResultModule detail location={activeLocation} /> }
            </div>
            <div className='gridsec images-wrapper'>
              <Images images={[
                'http://via.placeholder.com/500x350?text=location+image+1',
                'http://via.placeholder.com/500x350?text=location+image+2',
                'http://via.placeholder.com/500x350?text=location+image+3',
                'http://via.placeholder.com/500x350?text=location+image+4',
                'http://via.placeholder.com/500x350?text=location+image+5'
              ]} />
            </div>
            <div className='gridsec map-wrapper'><div className='map-inner'>{ Map }</div></div>
            <div className='gridsec copy-wrapper'></div>
            <div className='gridsec services-wrapper'></div>
          </div>
          <div className='gridsec specials-wrapper'>
            <h3><span />TODAY'S SPECIALS<span /></h3>
            <div className='specials-imgs'>
              { this.renderSpecials([
                'http://via.placeholder.com/500x350?text=special+1',
                'http://via.placeholder.com/500x350?text=special+2',
                'http://via.placeholder.com/500x350?text=special+3'
              ]) }
            </div>
            <div className='specials-copy'>a bunch of copy about specials</div>
          </div>
        </section>
        <style jsx>{`
            .template-wrapper {
              width: 100vw;
              position: relative;
            }
            .top-content {
              width: 96%;
              height: 50vh;
              margin: 2vw;
              display: grid;
              grid-template-areas:  'details map' 'images map' 'copy services';
              grid-template-columns: repeat(2, 1fr);
              grid-template-rows: repeat(3, 1fr);
            }
            .gridsec {
              padding: 1em;
            }
            .description-wrapper {
              grid-area: details;
            }
            .images-wrapper {
              grid-area: images;
            }
            .copy-wrapper {
              grid-area: copy;
              overflow: scroll;
            }
            .map-wrapper {
              grid-area: map;
              position: relative;
            }
            .map-inner {
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: flex-end;
            }
            .services-wrapper {
              grid-area: services;
            }
            .specials-wrapper {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-around;
            }
            .specials-wrapper h3 {
              display: flex;
              width: 100%;
              justify-content: space-around;
              align-items: center;
            }
            .specials-wrapper h3 span {
              border-top: 1px solid black;
              width: 30vw;
            }
            .specials-imgs {
              margin: 2vh 0;
            }
        `}</style>
      </div>
    )
  }
}

Detail.propTypes = {
  activeLocation: PropTypes.object.isRequired,
  onSetLocPageState: PropTypes.func.isRequired
}

export default Detail
