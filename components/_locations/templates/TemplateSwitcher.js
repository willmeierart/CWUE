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
            url={url}>
            { children }
          </Results>
        )
      case 'region':
        return <Region>{ children }</Region>
      case 'detail':
        return (
          <Detail
            onSetActiveLocation={onSetActiveLocation}
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

export default TemplateSwitcher
