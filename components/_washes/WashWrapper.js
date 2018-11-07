import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
import equal from 'deep-equal'
import WithApolloLoader from '../hoc/WithApolloLoader'
import WashesTable from './WashesTable'
import WashFastPassCallout from './WashFastPassCallout'
import washData from '../../lib/_data/washData'
import { allWashes } from '../../lib/apollo/queries'

class WashWrapper extends Component {
	constructor (props) {
		super(props)
		this.state = {
			type: 'exterior-washes', // exterior-washes || full-service || express-detail || fleet-accounts || specials
			menuHeaderText: 'EXTERIOR CAR WASH MENU',
			pageHeaderText: 'EXTERIOR WASHES'
		}
		this.fakeData = false
	}
	componentDidMount () {
		this.updateAll()
	}

	componentDidUpdate (prevProps) {
		if (!equal(this.props.url, prevProps.url)) {
			this.updateAll()
		}
	}

	setPageStateViaUrl = () => {
		const { query: { title }, asPath, pathname } = this.props.url
		const splitPath = asPath.split(`${pathname}/`)
		const backupTitle = splitPath[splitPath.length - 1]
		const thisTitle = title || 'exterior-washes'
		this.setState({ type: thisTitle })
	}

	updateAll = async () => {
		await this.setPageStateViaUrl()
		this.updateText()
	}

	updateText = () => {
		const typeKey = this.state.type.split('-')[0]
		const { pageHeaderText, menuHeaderText, descriptionText } = washData[typeKey]
		this.setState({
			pageHeaderText,
			menuHeaderText,
			descriptionText
		})
	}

	filterData = type => {
		const data = this.props.data.allWashes
		return data.reduce((acc, d) => {
			const formatted = d.washType.split('_')[0].toLowerCase()
			formatted === type && acc.push(d)
			return acc
		}, [])
	}

	render () {
		const { type } = this.state
		const typeKey = type.split('-')[0] || 'exterior'
		return (
			<div className='outer-wrapper'>
				<div className='inner-wrapper'>
					<div className='top-block'>
						<div className='col-2 col-left'>
							<h1>{this.state.pageHeaderText}</h1>
							<div className='type-description'>{this.state.descriptionText}</div>
						</div>
						<div className='col-2 col-right'>
							<WashFastPassCallout />
						</div>
					</div>
					<div className='menu-divider'>
						<span className='line' />
						<h2> {this.state.menuHeaderText} </h2>
						<span className='line' />
					</div>
					<div className='table-wrapper'>
						<WashesTable data={this.fakeData ? washData[typeKey].washes : this.filterData(typeKey)} />
					</div>
				</div>
				{/* <TemplateSwitcher template={template} /> */}
				<style jsx>{`
					.inner-wrapper {
						margin: 2vw;
					}
					.top-block {
						width: 100%;
						position: relative;
						display: flex;
						align-items: flex-end;
					}
					.col-2 {
						width: 50%;
						padding: 2vw;
					}
					.menu-divider {
						width: 100%;
						display: flex;
						justify-content: space-around;
						align-items: center;
					}
					.line {
						width: 20%;
						border-top: 1px solid black;
					}
				`}</style>
			</div>
		)
	}
}

WashWrapper.propTypes = {
	url: PropTypes.object.isRequired,
	data: PropTypes.object.isRequired
}

export default compose(graphql(allWashes))(WithApolloLoader(WashWrapper))
