import React from 'react'
import App, { Container } from 'next/app'
import { PageTransition } from 'next-page-transitions'
import withReduxStore from '../lib/redux/withReduxStore'
import AppProvider from '../lib/redux/AppProvider'
import { routes } from '../server/routes'

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
		const prettySafeUrl = (route) =>
			typeof route.prettyUrl === 'string' ? route.prettyUrl : route.prettyUrl({ title: '' })
		const thisRoute =
			router.asPath === '/' || router.asPath === 'carwash'
				? routes[0]
				: routes.filter((route) => prettySafeUrl(route).indexOf(router.pathname) !== -1).pop()
		const { title } = thisRoute

		return (
			<Container>
				<AppProvider store={reduxStore} url={router} title={title}>
					<PageTransition timeout={300} classNames='page-transition'>
						<Component url={router} {...pageProps}>
							{children}
						</Component>
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
						transition: opacity 300ms;
					}
					.page-transition-exit {
						opacity: 1;
					}
					.page-transition-exit-active {
						opacity: 0;
						transition: opacity 300ms;
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
