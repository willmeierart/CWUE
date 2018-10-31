const UrlPrettifier = require('next-url-prettifier').default
const qs = require('qs')

// custom router a la next-url-prettifier

const routes = [
	{
		page: 'index',
		title: 'Home',
		prettyUrl: '/carwash',
		prettyUrlPatterns: [
			{
				pattern: '/carwash',
				pattern: '/'
			}
		]
	},
	{
		page: 'washes',
		title: 'Car Washes',
		prettyUrl: ({ title = '' }) => {
			// client
			const root = title === 'Car Washes'
			return root ? '/carwash/washes' : `/carwash/washes/${title.toLowerCase().replace(' ', '-')}`
		},
		prettyUrlPatterns: [
			// server
			{
				pattern: '/carwash/washes/:title',
				defaultParams: {
					title: 'exterior-washes'
				}
			},
			{
				pattern: '/carwash/washes',
				defaultParams: {
					title: 'exterior-washes'
				}
			}
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
		prettyUrl: '/carwash/fastpass'
	},
	{
		page: 'about',
		title: 'About',
		prettyUrl: ({ title = '' }) => {
			return title === 'About' ? '/carwash/about' : `/carwash/about/${title.toLowerCase()}`
		},
		prettyUrlPatterns: [
			{
				pattern: '/carwash/about/:title',
				defaultParams: {}
			},
			{
				pattern: '/carwash/about',
				defaultParams: {}
			}
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
		page: 'locationsInitial',
		title: 'Locations',
		prettyUrl: '/carwash/locations'
	},
	{
		page: 'locationsResults',
		title: 'Location Results',
		prettyUrl: ({ spec = '' }) => {
			if (spec && spec !== '') {
				// trying to handle a variety of error cases here
				return `/carwash/locations/results/${spec.toLowerCase().replace(/( )/g, '-')}`
			} else {
				return '/carwash/locations/results'
			}
		},
		prettyUrlPatterns: [
			{
				pattern: '/carwash/locations/results/:spec',
				defaultParams: {
					spec: ''
				}
			}
		]
	},
	{
		page: 'locationsDetail',
		title: 'Location Detail',
		prettyUrl: ({ spec = '' }) => {
			if (spec && spec !== '') {
				return `/carwash/locations/detail/${spec.toLowerCase().replace(/( )/g, '-')}`
			} else {
				return '/carwash/locations/detail'
			}
		},
		prettyUrlPatterns: [
			{
				pattern: '/carwash/locations/detail/:spec',
				defaultParams: {
					spec: ''
				}
			}
		]
	},
	{
		page: null,
		title: 'My Account',
		prettyUrl: ''
	},
	{
		page: 'legal',
		title: 'Legal',
		prettyUrl: '/legal'
	}
]

// const urlPrettifier = new UrlPrettifier(routes)
const Router = new UrlPrettifier(routes, {
	paramsToQueryString: (params) => (params.query ? `?${qs.stringify(params.query)}` : '')
})

exports.routes = routes
exports.Router = Router
