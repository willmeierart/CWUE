import Document, { Head, Main, NextScript } from 'next/document'
import flush from 'styled-jsx/server'

export default class CustomDocument extends Document {
	constructor (props) {
		super(props)
		this.report = false
	}

	static async getInitialProps (ctx) {
		const initialProps = await Document.getInitialProps(ctx)
		const maps_key = process.env.NEXT_PUBLIC_GEOCODE_KEY
		return { ...initialProps, maps_key }
	}
	render () {
		return (
			<html>
				<Head />
				<body>
					<Main />
					<NextScript />
					<script
						key='google-map'
						type='text/javascript'
						async
						defer
						src={`https://maps.googleapis.com/maps/api/js?key=${this.props.maps_key}&libraries=places`}
					/>
					{/* including this here enables it to load async, rather than in the head tag, don't ask me why... */}
					{this.report && (
						<script
							type='text/javascript'
							src='https://agencyzero.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/urqn51/b/7/a44af77267a987a660377e5c46e0fb64/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-US&collectorId=885b72a6'
						/>
					)}
				</body>
			</html>
		)
	}
}
