import PropTypes from 'prop-types'
import Initial from './Initial'
import Results from './Results'
import Region from './Region'
import Detail from './Detail'

const TemplateSwitcher = ({
  template,
  setTemplate,
  children,
  onGetUserLocation,
  userLocation,
  userIsLocated,
  onSetActiveLocation,
  activeLocation,
  activeResults,
  setActiveResults,
  searchPhrase,
  onMakeUserLocationPage,
  isUserLocationPage,
  url
}) => {
  const componentSwitcher = () => {
    switch (template) {
      case 'initial':
        return (
          <Initial
            onGetUserLocation={onGetUserLocation}
            onMakeUserLocationPage={onMakeUserLocationPage}
            userLocation={userLocation}>
            { children }
          </Initial>
        )
      case 'results':
        return (
          <Results
            setTemplate={setTemplate}
            isUserLocationPage={isUserLocationPage}
            activeResults={activeResults}
            setActiveResults={setActiveResults}
            onGetUserLocation={onGetUserLocation}
            onSetActiveLocation={onSetActiveLocation}
            searchPhrase={searchPhrase}
            userLocation={userLocation}
            userIsLocated={userIsLocated}
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
            userIsLocated={userIsLocated}
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
  userIsLocated: PropTypes.bool.isRequired,
  isUserLocationPage: PropTypes.bool.isRequired,
  onMakeUserLocationPage: PropTypes.func.isRequired,
  onSetActiveLocation: PropTypes.func.isRequired,
  activeLocation: PropTypes.object.isRequired,
  activeResults: PropTypes.array.isRequired,
  setActiveResults: PropTypes.func.isRequired,
  searchPhrase: PropTypes.string.isRequired,
  url: PropTypes.object.isRequired
}

export default TemplateSwitcher
