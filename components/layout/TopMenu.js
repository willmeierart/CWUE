import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'next-url-prettifier'
import { Router, routes } from '../../server/routes'

export default class TopMenu extends Component {
	constructor (props) {
		super(props)
		this.state = {
			showWashSubList: false,
			showAboutSubList: false
		}
	}

	handleHover = item => {
		if (item === 'washes') {
			this.setState({ showWashSubList: true })
		} else {
			this.setState({ showWashSubList: false })
		}
		if (item === 'about') {
			this.setState({ showAboutSubList: true })
		} else {
			this.setState({ showAboutSubList: false })
		}
	}

	renderSubList = route => {
		return route.children.reduce((a, b, i) => {
			const { title } = b
			const formattedTitle = title.toLowerCase().replace(' ', '-')
			a.push(
				<li
					ref={el => {
						this[route.page] = el
					}}
					key={i}
					className='child-route'
				>
					<Link prefetch route={Router.getPrettyUrl(route.page, { title: formattedTitle })}>
						<a>{title}</a>
					</Link>
					<style jsx>{`
						li {
							padding-top: .5em;
							text-align: center;
							font-size: .75em;
							font-weight: normal;
							color: var(--color-red);
						}
						li:hover {
							color: var(--color-blue);
						}
					`}</style>
				</li>
			)
			if (i !== route.children.length - 1) {
				a.push(
					<div key={`xx${i}xx`}>
						<style jsx>{`
							div {
								width: 1px;
								height: 3em;
								background: var(--color-blue);
							}
						`}</style>
					</div>
				)
			}
			return a
		}, [])
	}
	renderList = () => {
		const { showAboutSubList, showWashSubList } = this.state
		return (
			<ul>
				{routes.map(route => {
					switch (route.title) {
						case 'Car Washes':
							return (
								<li
									key={route.title}
									className={showWashSubList && 'active'}
									onMouseOver={() => {
										this.handleHover('washes')
									}}
								>
									<Link
										prefetch
										route={Router.getPrettyUrl(route.page, {
											title: route.title
										})}
									>
										<a>{route.title}</a>
									</Link>
									<ul className='sub-ul'>{showWashSubList && this.renderSubList(route)}</ul>
								</li>
							)
						case 'Fast Pass - Unlimited':
							return (
								<li key={route.title} onMouseOver={this.handleHover}>
									<Link
										prefetch
										route={Router.getPrettyUrl(route.page, {
											title: route.title
										})}
									>
										<a>{route.title}</a>
									</Link>
								</li>
							)
						case 'About':
							return (
								<li
									className={showAboutSubList && 'active'}
									key={route.title}
									onMouseOver={() => {
										this.handleHover('about')
									}}
								>
									<Link
										prefetch
										route={Router.getPrettyUrl(route.page, {
											title: route.title
										})}
									>
										<a>{route.title}</a>
									</Link>
									<ul className='sub-ul'>{showAboutSubList && route.children && this.renderSubList(route)}</ul>
								</li>
							)
						case 'Locations':
							return (
								<li key={route.title} onMouseOver={this.handleHover}>
									<Link prefetch route={Router.getPrettyUrl(route.page, {})}>
										<a className='locations'>FIND A LOCATION</a>
									</Link>
								</li>
							)
						case 'My Account':
							return null
						default:
							return null
					}
				})}
				<style jsx>{`
					ul {
						display: flex;
						font-size: 0.75em;
						justify-content: space-between;
						flex-grow: 0;
						align-items: center;
						flex-grow: 0;
						width: 100%;
						left: 0;
						position: relative;
						margin-left: 3vw;
						width: 80%;
					}
					.sub-ul {
						margin: 0;
						flex-grow: 1;
						position: absolute;
						display: flex;
						align-items: center;
						margin-top: 1em;
						justify-content: space-between;
						width: 90%;
					}
					li {
						margin-right: 6vw;
						white-space: nowrap;
						cursor: pointer;
						text-transform: uppercase;
						color: var(--color-blue);
						font-weight: bold;
					}
					li.active,
					li:hover {
						color: var(--color-red);
					}
					.account {
						top: 5px;
						right: 5px;
						color: grey;
					}
				`}</style>
			</ul>
		)
	}

	render () {
		return (
			<div className='top-menu'>
				<div className='list-wrapper'>
					<div>{this.renderList()}</div>
				</div>
				<div className='gate' onMouseOver={this.handleHover} />
				<div className='gate2' onMouseOver={this.handleHover} />
				<style jsx>{`
					.top-menu {
						width: 100%;
						position: relative;
					}
					.gate {
						position: absolute;
						top: 70px;
						width: 100%;
						height: 10px;
					}
					.gate2 {
						position: absolute;
						height: 300%;
						left: 0;
						top: -100%;
						width: 10px;
					}
				`}</style>
			</div>
		)
	}
}

TopMenu.propTypes = {
	url: PropTypes.object.isRequired
}
