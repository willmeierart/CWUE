const UrlPrettifier = require('next-url-prettifier').default
const qs = require('qs')
const NextRouter = require('next/router')

// custom router a la next-url-prettifier

const routes = [
  {
    page: 'index',
    title: 'Home',
    prettyUrl: '/carwash'
  },
  {
    page: 'washes',
    title: 'Car Washes',
    prettyUrl: ({ title }) => { // client
      const root = title === 'Car Washes'
      return root
        ? '/carwash/washes'
        : `/carwash/washes/${title.toLowerCase().replace(' ', '-')}`
    },
    prettyUrlPatterns: [ // server
      { pattern: '/carwash/washes/:title', defaultParams: {} }
    ],
    children: [
      { title: 'Exterior Washes' },
      { title: 'Full Service' },
      { title: 'Express Detail' },
      { title: 'Fleet Accounts' },
      { title: 'Specials' }
    ]
  },
  {
    page: 'fastpass',
    title: 'Fast Pass - Unlimited',
    prettyUrl: '/fastpass'
  },
  {
    page: 'about',
    title: 'About',
    prettyUrl: ({ title }) => {
      return title === 'About'
        ? '/carwash/about'
        : `/carwash/about/${title.toLowerCase()}`
    },
    prettyUrlPatterns: [
      { pattern: '/carwash/about/:title', defaultParams: {} }
    ],
    children: [
      { title: 'Company' },
      { title: 'Testimonials' },
      { title: 'News' },
      { title: 'Careers' },
      { title: 'FAQ' },
      { title: 'Contact' }
    ]
  },
  {
    page: 'locations',
    title: 'Locations',
    prettyUrl: ({ state = '', spec = '', spec2 = '' }) => {
      switch (state) {
        case 'initial':
          return '/carwash/locations'
        case 'results':
          if (spec && spec !== '') {
            return `/carwash/locations/results?search=${spec.toLowerCase().replace(/( )/g, '-')}`
          } else {
            return '/carwash/locations'
          }
        case 'region':
          if (spec && spec !== '') {
            if (spec2 && spec2 !== '') {
              return `/carwash/locations/region/${spec}/${spec2}`
            } else {
              return `/carwash/locations/region/${spec}`
            }
          } else {
            return `/carwash/locations/region/state`
          }
        case 'detail':
          if (spec && spec !== '') {
            return `/carwash/locations/detail/${spec.toLowerCase().replace(/( )/g, '-')}`
          } else {
            return '/carwash/locations'
          }
        default:
          return '/carwash/locations'
      }
    },
    prettyUrlPatterns: [
      { pattern: '/carwash/locations', defaultParams: { state: 'initial' } },
      { pattern: '/carwash/locations/results?search=:spec', defaultParams: { state: 'results' } },
      { pattern: '/carwash/locations/region/:spec', defaultParams: { state: 'region' } },
      { pattern: '/carwash/locations/detail/:spec', defaultParams: { state: 'detail' } }
    ]
  },
  {
    page: null,
    title: 'My Account'
    // prettyUrl: '/my-account'
  },
  {
    page: 'legal',
    title: 'Legal',
    prettyUrl: '/legal'
  }
]

// const urlPrettifier = new UrlPrettifier(routes)
const Router = new UrlPrettifier(routes, {
  paramsToQueryString: (params) => params.query ? `?${qs.stringify(params.query)}` : ''
})

exports.routes = routes
exports.Router = Router
