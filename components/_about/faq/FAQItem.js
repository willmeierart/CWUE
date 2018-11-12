import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class FAQitem extends Component {
	constructor (props) {
		super(props)
		this.state = {
			open: false
		}
	}

	handleClick = () => {
		this.setState({ open: !this.state.open })
	}

	render () {
		return (
			<div onClick={this.handleClick} className='outer-container'>
				<div className='inner-container'>
					<div className='q'>
						<div className='letter'>Q:</div>
						<div>
							Austin live-edge ethical, ramps brunch selvage pinterest everyday carry pok pok succulents artisan
							leggings banjo lomo?
						</div>
					</div>
					{this.state.open && (
						<div className='a'>
							<div className='letter'>A:</div>
							<div>
								Semiotics godard thundercats bicycle rights pop-up tousled microdosing gentrify try-hard portland vegan
								seitan pork belly gochujang 8-bit.
							</div>
						</div>
					)}
				</div>
				<style jsx>{`
					.outer-container {
						display: flex;
						justify-content: center;
						width: 100%;
					}
					.inner-container {
						border: 1px solid black;
						border-radius: 5px;
						width: 75%;
						margin: 1em;
					}
					.q,
					.a {
						padding: 1em;
						display: flex;
					}
					.q {
						cursor: pointer;
					}
					.a {
						border-top: 1px solid black;
						background: lightgrey;
					}
					.letter {
						font-size: 2em;
						font-weight: bold;
						margin-right: 1em;
					}
				`}</style>
			</div>
		)
	}
}

FAQitem.propTypes = {}
