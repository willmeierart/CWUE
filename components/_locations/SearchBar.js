import React, { Component } from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import ExecutionEnvironment from 'exenv'
import ImperativeRouter from '../../server/ImperativeRouter'
import { reverseGeocode } from '../../lib/_locationUtils'
import { binder } from '../../lib/_utils'
import SearchManager from './data_managers/Search'

class SearchBar extends Component {
  constructor (props) {
    super(props)
    this.state = { autocompleteItems: [], value: '', markers: [], isServer: !ExecutionEnvironment.canUseDOM, freshLoad: true, specialVal: '' }
    binder(this, ['autocompleteCallback',
      'clearSuggestions',
      'fetchPredictions',
      'selectAddress',
      'handleSelect',
      'getActiveItem',
      'selectActiveItemAtIndex',
      'handleEnterKey',
      'handleEnterKeyWithoutActiveItem',
      'handleDownKey',
      'handleUpKey',
      'handleInputKeyDown',
      'setActiveItemAtIndex',
      'handleInputChange',
      'handleInputOnBlur',
      'renderSuggestion',
      'renderFooter',
      'handleInput',
      'getInputProps',
      'handleSearchOnSSR',
      'generateState'
    ])
    this.debouncedFetchPredictions = debounce(this.fetchPredictions, 800)
    this.highlightFirstSuggestion = false
    this.shouldFetchSuggestions = (thing) => { if (thing) return true }
  }

  componentDidMount () {
    console.log(this.props)
    this.handleSearchOnSSR()
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.userLocation !== prevProps.userLocation && this.state.specialVal !== '') {
      console.log(this.props.userLocation)
      // this.generateState(this.state.specialVal)
    }
    if (this.state.specialVal !== prevState.specialVal) {
      console.log(this.state, prevState)
      this.props.setMapZoomModifier(-2)
      this.generateState(this.state.specialVal)
    }
  }

  handleSearchOnSSR () {
    const {
      searchPhrase,
      activeResults,
      url: { asPath },
      userLocation,
      setMapZoomModifier,
      isUserLocationPage,
      userIsLocated
    } = this.props
    const noActiveSearch = !searchPhrase && activeResults.length === 0
    const pathSplitta = asPath.split('results/')[1]
    const hasQueryString = pathSplitta && pathSplitta !== ''
    // const isUserLocation = pathSplitta === 'my-location'

    if (noActiveSearch) {
      if (hasQueryString) {
        if (isUserLocationPage) {
          // if (typeof userLocation === 'object') {
          if (userIsLocated) {
            console.log('awaiting userlocation', userLocation)
            this.props.onGetUserLocation(null, () => {
              reverseGeocode(userLocation, val =>
                this.setState({ specialVal: val })
              )
            })
          } else {
            reverseGeocode(userLocation, (val) =>
              this.setState({specialVal: val})
            )
          }
          setMapZoomModifier(-2)
          console.log('geocode was fired')
          // } else {
          //   ImperativeRouter.push('locations', { state: 'initial' }, false)
          // }
        } else {
          const searchVal = asPath.split('results/')[1].replace(/[-]/g, ' ')
          if (searchVal !== 'my location') {
            this.generateState(searchVal)
          }
          // else {
          //   ImperativeRouter.push('locations', { state: 'initial' }, false)
          // }
        }
      } else {
        ImperativeRouter.push('locations', { state: 'initial' }, false)
      }
    }
  }

  generateState (searchVal) {
    console.log(searchVal)
    this.setState({
      value: searchVal,
      freshLoad: true
    }, async () => {
      console.log(this.state)
      await this.fetchPredictions()
    })
  }

  fetchPredictions () {
    // console.log(value)
    // magical google autocomplete connector function
    const { value } = this.state
    if (value.length) {
      this.props.autocompleteService.getPlacePredictions(
        { ...this.props.options, input: value },
        this.autocompleteCallback
      )
    }
  }

  selectAddress (address, placeId, e) {
    // called by each handler: enter / mousedown / touchend
    if (e !== undefined) { e.preventDefault() }

    this.clearSuggestions()
    this.handleSelect(address, placeId, this.handleInput) // these are properties on the 'active selection' object
  }

  handleSelect (address, placeId, handleInput) {
    const {isUserLocationPage, onMakeUserLocationPage, handleSelection} = this.props
    if (isUserLocationPage) {
      onMakeUserLocationPage(false)
    }
    handleSelection(address, placeId, handleInput)
  }

  handleInput (val) { this.setState({ value: val, freshLoad: this.state.freshLoad && false }) } // val = address (active selection)

  clearSuggestions () { this.setState({ autocompleteItems: [] }) }

  getActiveItem () { return this.state.autocompleteItems.find(item => item.active) }

  selectActiveItemAtIndex (index) {
    // this is what points at a certain item and selects that one specifically
    const activeName = this.state.autocompleteItems.find(item => item.index === index).suggestion
    this.setActiveItemAtIndex(index) // below
    this.handleInput(activeName) // above
  }

  setActiveItemAtIndex (index) {
    this.setState({
      autocompleteItems: this.state.autocompleteItems.map((item, idx) => {
        if (idx === index) {
          return { ...item, active: true }
        } else {
          return { ...item, active: false }
        }
      })
    })
  }

  handleEnterKey (val) {
    const activeItem = this.getActiveItem()
    console.log(activeItem)
    if (activeItem === undefined) {
      this.handleEnterKeyWithoutActiveItem()
    } else {
      this.selectAddress(activeItem.suggestion, activeItem.placeId)
    }
  }

  handleEnterKeyWithoutActiveItem () {
    const { autocompleteItems } = this.state
    if (autocompleteItems.length > 0) {
      const activeItem = autocompleteItems[0]
      this.selectAddress(activeItem.suggestion, activeItem.placeId)
    } else {
      console.warn('no active item')
    }
  }

  handleDownKey () {
    if (this.state.autocompleteItems.length === 0) return
    const activeItem = this.getActiveItem()
    if (activeItem === undefined) {
      this.selectActiveItemAtIndex(0)
    } else {
      const nextIndex = (activeItem.index + 1) % this.state.autocompleteItems.length
      this.selectActiveItemAtIndex(nextIndex)
    }
  }

  handleUpKey () {
    if (this.state.autocompleteItems.length === 0) return
    const activeItem = this.getActiveItem()
    if (activeItem === undefined) {
      this.selectActiveItemAtIndex(this.state.autocompleteItems.length - 1)
    } else {
      let prevIndex
      if (activeItem.index === 0) {
        prevIndex = this.state.autocompleteItems.length - 1
      } else {
        prevIndex = (activeItem.index - 1) % this.state.autocompleteItems.length
      }
      this.selectActiveItemAtIndex(prevIndex)
    }
  }

  handleInputKeyDown (event) {
    switch (event.key) {
      case 'Enter' :
        event.preventDefault()
        this.handleEnterKey(event.target.value)
        break
      case 'ArrowDown' :
        event.preventDefault()
        this.handleDownKey()
        break
      case 'ArrowUp' :
        event.preventDefault()
        this.handleUpKey()
        break
      case 'Escape' :
        this.clearSuggestions()
        break
      default :
        break
    }
    // if (this.props.inputProps.onKeyDown) { this.props.inputProps.onKeyDown(event) }
  }

  handleInputChange (event) {
    const { value } = event.target
    this.handleInput(value)
    if (!value) {
      this.clearSuggestions()
      return
    }
    if (this.shouldFetchSuggestions({ value })) {
      this.debouncedFetchPredictions()
    }
  }

  handleInputOnBlur (event) { this.clearSuggestions() }

  getInputProps () {
    const defaultInputProps = {
      type: 'text',
      autoComplete: 'off'
    }
    return {
      ...defaultInputProps,
      onChange: e => { this.handleInputChange(e) },
      onKeyDown: e => { this.handleInputKeyDown(e) },
      onBlur: e => { this.handleInputOnBlur(e) },
      value: this.state.value
    }
  }

  autocompleteCallback (predictions, status) {
    console.log(predictions)
    // called by this.fetchPredictions, used as callback to native google autocomplete func
    // predictions are each full object returned from autocompleteservice
    if (status !== this.props.autocompleteOK) {
      this.clearSuggestions()
      return
    }
    const formattedSuggestion = format => ({
      main: format.main_text,
      secondary: format.secondary_text
    })
    this.setState({
      autocompleteItems: predictions.map((p, idx) => ({
        suggestion: p.description,
        placeId: p.place_id,
        active: this.highlightFirstSuggestion && idx === 0,
        index: idx,
        formattedSuggestion: formattedSuggestion(p.structured_formatting)
      }))
    })
    if (this.state.freshLoad && this.props.url.query.state === 'results') {
      this.handleEnterKeyWithoutActiveItem()
    }
  }

  renderSuggestion ({ suggestion }) { return <div>{ suggestion }</div> }

  renderFooter () {}

  render () {
    const { autocompleteItems } = this.state
    const inputProps = this.getInputProps()

    return (
      <div className='searchbar-wrapper'>
        <div className='searchbar-root'>
          <input className='searchbar-input' {...inputProps} placeholder='Please enter a location' />
          <div className='searchbar-autocompleteContainer'>
            { autocompleteItems.map((p, idx) => (
              <div key={p.placeId} className={p.active ? 'searchbar-autocompleteItemActive' : 'searchbar-autocompleteItem'}
                onMouseOver={() => this.setActiveItemAtIndex(p.index)}
                onMouseDown={e => this.selectAddress(p.suggestion, p.placeId, e)}
                onTouchStart={() => this.setActiveItemAtIndex(p.index)}
                onTouchEnd={e => this.selectAddress(p.suggestion, p.placeId, e)}>
                { this.renderSuggestion({
                  suggestion: p.suggestion,
                  formattedSuggestion: p.formattedSuggestion
                }) }
              </div>
            )) }
            { this.renderFooter() }
          </div>
        </div>
        <style jsx>{`
          .searchbar-wrapper {
            margin-bottom: 2vh;
            width: 100%;
            display: flex;
          }

          .searchbar-root {
            position: relative;
            padding-bottom: 0px;
            z-index: 10;
            width: 100vw;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .searchbar-input {
            display: inline-block;
            padding: 10px;
            width: 50%;
            left:25%;
            border-radius: 3px;
            border: 1px solid black;
          }

          .searchbar-autocompleteContainer {
            position: absolute;
            top: 99%;
            background-color: white;
            border: 1px solid #555555;
            width: 50%;
            display: flex;
            flex-direction: column;
          };
          .searchbar-autocompleteItem{
            background-color: #ffffff;
          }
          .searchbar-autocompleteItem, 
          .searchbar-autocompleteItemActive {
            padding: 10px;
            color:black;
            cursor: pointer;
          };
          .searchbar-autocompleteItemActive {
            background-color: #fafafa;
          }

        `}</style>
      </div>
    )
  }
}

SearchBar.propTypes = {
  activeResults: PropTypes.array.isRequired,
  autocompleteOK: PropTypes.string,
  autocompleteService: PropTypes.object,
  data: PropTypes.object.isRequired,
  distanceService: PropTypes.object,
  onSetActiveSearchPhrase: PropTypes.func.isRequired,
  onGetUserLocation: PropTypes.func.isRequired,
  setActiveResults: PropTypes.func.isRequired,
  setCenter: PropTypes.func.isRequired,
  setMarkers: PropTypes.func.isRequired,
  setTemplate: PropTypes.func.isRequired,
  staticLocationList: PropTypes.array.isRequired,
  url: PropTypes.object.isRequired,
  userLocation: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  setMapZoomModifier: PropTypes.func.isRequired
}

export default SearchManager(SearchBar)
