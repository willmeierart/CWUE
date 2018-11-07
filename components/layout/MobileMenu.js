import React, { Component } from 'react'
import { Link } from 'next-url-prettifier'
import { Router, routes } from '../../server/routes'
import ImperativeRouter from '../../server/ImperativeRouter'

class MobileMenu extends Component {
	constructor (props) {
		super(props)
		this.state = {
			aboutExpanded: false,
			washesExpanded: false
		}
	}

	handleClick = (route, hasChildren) => {
		console.log('route', route)
		if (hasChildren) {
			if (route.page === 'about') {
				this.setState({ aboutExpanded: !this.state.aboutExpanded, washesExpanded: false })
			} else {
				this.setState({ washesExpanded: !this.state.washesExpanded, aboutExpanded: false })
			}
		} else {
			ImperativeRouter.push('locationsInitial', {}, false)
			ImperativeRouter.onRouteChangeComplete(this.props.closeMenu)
		}
	}
	renderSubList = route => {
		console.log(route.children)
		const list = route.children.map((child, i) => {
			const { title } = child
			return (
				<li
					ref={el => {
						this[route.page] = el
					}}
					key={i}
					className='child-route'
					onClick={() => {
						this.handleClick(route, false, child)
					}}
				>
					<Link>
						<a>{title}</a>
					</Link>
					<style jsx>{`
						li {
							padding-top: .5em;
							text-align: center;
							font-size: .75em;
							font-weight: normal;
							color: var(--color-blue);
							background-color: #f0f0f0;
							border-top: ${i === 0 ? '2px solid var(--color-blue)' : '1px solid white'};
							width: 100%;
							font-weight: normal;
						}
						li:hover {
							color: var(--color-red);
						}
					`}</style>
				</li>
			)
		})
		if (
			(route.page === 'washes' && this.state.washesExpanded) ||
			(route.page === 'about' && this.state.aboutExpanded)
		) {
			return list
		}
	}

	renderList = () => {
		return routes
			.filter(
				route =>
					route.title.toLowerCase().indexOf('account') === -1 && route.title.toLowerCase().indexOf('legal') === -1
			)
			.map((route, i) => {
				// const formattedTitle = route.title.toLowerCase().replace(' ', '-')
				const hasChildren = route.children && route.children.length > 0
				return (
					<li
						key={route.title}
						onClick={() => {
							this.handleClick(route, hasChildren, null)
						}}
					>
						{/* <Link prefetch route={Router.getPrettyUrl(route.page, { title: formattedTitle })}> */}
						<Link>
							<a>{route.title.toUpperCase()}</a>
							<ul className='sublist'>{hasChildren && this.renderSubList(route, hasChildren, null)}</ul>
						</Link>
						<style jsx>{`
							li {
								color: var(--color-blue);
								text-align: center;
								line-height: 3em;
								display: flex;
								align-items: center;
								justify-content: center;
								flex-direction: column;
								border-top: 2px solid var(--color-blue);
								width: 100vw;
								cursor: pointer;
								font-weight: bold;
							}
							li:hover {
								color: var(--color-red);
							}
							.sublist {
								width: 100%;
							}
						`}</style>
					</li>
				)
			})
	}
	render () {
		return (
			<div className='menu-outer'>
				<div className='menu-inner'>
					<ul>{this.renderList()}</ul>
				</div>
				<style jsx>{`
					.menu-outer {
						position: absolute;
						top: 0;
						left: 0;
						width: 100vw;
						min-height: 100vh;
						height: 100%;
						background: white;
					}
					.menu-inner {
						position: relative;
						width: 100%;
						height: 100%;
					}
					ul {
						display: flex;
						flex-direction: column;
						align-items: center;
						width: 100%;
						height: 100%;
						padding: 0;
					}
				`}</style>
			</div>
		)
	}
}

export default MobileMenu
