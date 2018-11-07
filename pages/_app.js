import React from 'react'
import App, { Container } from 'next/app'
import { PageTransition } from 'next-page-transitions'
import withReduxStore from '../lib/redux/withReduxStore'
import AppProvider from '../lib/redux/AppProvider'
import { routes } from '../server/routes'
import Loader from 'react-loader'
import ImperativeRouter from '../server/ImperativeRouter'
// import Loader from '../components/ui/Loader'

class MyApp extends App {
	static async getInitialProps ({ Component, ctx }) {
		let pageProps = {}
		if (Component.getInitialProps) {
			pageProps = await Component.getInitialProps(ctx)
		}
		return { pageProps }
	}
	componentDidCatch (error, errorInfo) {
		// This is needed to render errors correctly in development / production
		super.componentDidCatch(error, errorInfo)
	}

	render () {
		const { Component, pageProps, reduxStore, children, router } = this.props
		const prettySafeUrl = route => {
			// console.log(route)
			return route.page
				? typeof route.prettyUrl === 'string' ? route.prettyUrl : route.prettyUrl({ title: '' })
				: '/my-account'
		}
		const thisRoute =
			router.asPath === '/' || router.asPath === 'carwash'
				? routes[0]
				: routes
						.filter(route => {
							console.log(prettySafeUrl(route), router.asPath)
							return router.asPath.indexOf(prettySafeUrl(route).substring(0, prettySafeUrl(route).length - 2)) !== -1
						})
						.pop() || routes[0]

		console.log(thisRoute, router)
		// const title = ''

		const title = thisRoute.title || ''

		const loaderOptions = {
			lines: 10,
			fps: 30,
			color: 'var(--color-blue)',
			position: 'relative'
		}

		return (
			<Container>
				<AppProvider store={reduxStore} url={router} title={title}>
					<PageTransition
						timeout={300}
						loadingDelay={500}
						loadingTimeout={{
							enter: 400,
							exit: 0
						}}
						loadingClassNames='loading-indicator'
						loadingComponent={<Loader />}
						// loadingComponent={<Loader options={loaderOptions} loaded={false} />}
						classNames='page-transition'
					>
						<Component key={thisRoute.title} url={router} {...pageProps} />
					</PageTransition>
				</AppProvider>
				<style jsx global>{`
					body {
						--color-red: #c73a37;
						--color-blue: #36659a;
						--color-darkgrey: #b0b0b0;
						--color-lightgrey: #f0f0f0;
						--font-body: 'Gotham Book', sans-serif;
						--font-header: 'Gotham', sans-serif;
						--font-prices: 'Monterrat', sans-serif;
						font-family: sans-serif;
						font-family: 'Gotham Book', sans-serif;
						width: 100vw;
						height: 100%;
						box-sizing: border-box;
						padding: 0;
						margin: 0;
						overflow-x: hidden;
					}
					h1 {
						font-size: 4em;
						font: var(--font-header);
					}
					h2 {
						font-size: 2.25em;
						font: var(--font-header);
					}
					h3 {
						font-size: 1.25em;
						letter-spacing: .04em;
					}
					h4 {
						font-size: .83em;
						font: var(--font-header);
					}
					a {
						text-decoration: none;
						color: inherit;
					}
					ul,
					li {
						list-style: none;
						padding-left: 0;
						margin-left: 0;
						--webkit-padding-before: 0;
					}
					.page-transition-enter {
						opacity: 0;
					}
					.page-transition-enter-active {
						opacity: 1;
						transition: opacity 300ms;
					}
					.page-transition-exit {
						opacity: 1;
					}
					.page-transition-exit-active {
						opacity: 0;
						transition: opacity 300ms;
					}
					.loading-indicator-appear,
					.loading-indicator-enter {
						opacity: 0;
					}
					.loading-indicator-appear-active,
					.loading-indicator-enter-active {
						opacity: 1;
						transition: opacity 400ms;
					}
				`}</style>
			</Container>
		)
	}
}

export default withReduxStore(MyApp)
