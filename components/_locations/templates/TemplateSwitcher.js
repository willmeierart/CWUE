import PropTypes from 'prop-types'
import Initial from './Initial'
import Results from './Results'
import Region from './Region'
import Detail from './Detail'

const TemplateSwitcher = ({
  template,
  children,
  onGetUserLocation,
  userLocation,
  onSetActiveLocation,
  activeLocation,
  activeResults,
  setActiveResults,
  searchPhrase,
  url
}) => {
  const componentSwitcher = () => {
    switch (template) {
      case 'initial':
        return (
          <Initial
            onGetUserLocation={onGetUserLocation}
            userLocation={userLocation}>
            { children }
          </Initial>
        )
      case 'results':
        return (
          <Results
            activeResults={activeResults}
            setActiveResults={setActiveResults}
            onSetActiveLocation={onSetActiveLocation}
            searchPhrase={searchPhrase}
            userLocation={userLocation}
            url={url}>
            { children }
          </Results>
        )
      case 'region':
        return <Region>{ children }</Region>
      case 'detail':
        return (
          <Detail
            activeLocation={activeLocation}>
            { children }
          </Detail>
        )
      default :
        return (
          <Initial
            onGetUserLocation={onGetUserLocation}
            userLocation={userLocation}>
            { children }
          </Initial>
        )
    }
  }
  return componentSwitcher()
}

TemplateSwitcher.propTypes = {
  template: PropTypes.string.isRequired,
  onGetUserLocation: PropTypes.func.isRequired,
  userLocation: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  onSetActiveLocation: PropTypes.func.isRequired,
  activeLocation: PropTypes.object.isRequired,
  activeResults: PropTypes.array.isRequired,
  setActiveResults: PropTypes.func.isRequired,
  searchPhrase: PropTypes.string.isRequired,
  url: PropTypes.object.isRequired
}

export default TemplateSwitcher
