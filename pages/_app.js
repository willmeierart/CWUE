import React from 'react'
import App, { Container } from 'next/app'
import { PageTransition } from 'next-page-transitions'
import withReduxStore from '../lib/redux/withReduxStore'
import AppProvider from '../lib/redux/AppProvider'
import { routes } from '../server/routes'
import Loader from 'react-loader'

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
							// console.log(prettySafeUrl(route), router.asPath)
							return router.asPath.indexOf(prettySafeUrl(route)) !== -1
						})
						.pop()

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
						timeout={500}
						loadingDelay={1000}
						loadingTimeout={{
							enter: 800,
							exit: 0
						}}
						loadingClassNames='loading-indicator'
						loadingComponent={<Loader options={loaderOptions} loaded={false} />}
						classNames='page-transition'
					>
						<Component key={thisRoute.title} url={router} {...pageProps} />
					</PageTransition>
				</AppProvider>
				<style jsx global>{`
					body {
						height: 100vh;
						width: 100vw;
						box-sizing: border-box;
					}
					.page-transition-enter {
						opacity: 0;
					}
					.page-transition-enter-active {
						opacity: 1;
						transition: opacity 1000ms;
					}
					.page-transition-exit {
						opacity: 1;
					}
					.page-transition-exit-active {
						opacity: 0;
						transition: opacity 1000ms;
					}
					a {
						text-decoration: none;
						color: inherit;
					}
					li {
						list-style: none;
					}
				`}</style>
				{/* <style dangerouslySetInnerHTML={{ __html: globalStyles }} /> */}
			</Container>
		)
	}
}

export default withReduxStore(MyApp)
