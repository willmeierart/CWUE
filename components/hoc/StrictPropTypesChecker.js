import StrictPropTypes from 'react-strict-prop-types'

export default (...args) => {
  if (process.env.NODE_ENV === 'production') {
    return args[0]
  }
  return StrictPropTypes(...args)
}