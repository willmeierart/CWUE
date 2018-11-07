import { Link } from 'next-url-prettifier'
import { Router } from '../../server/routes'

const StoryCallout = () => (
	<div className='callout'>
		<Link prefetch route={Router.getPrettyUrl('/about', { title: 'company' })}>
			<a>
				<div className='box'>
					<div className='txt'>
						<div className='bold large'>OUR STORY</div>
						<div>
							Car Wash USA Express is the largest express exterior car wash in the Mid-South. Our focus is to provide
							you with the very best car wash, period. We have friendly and knowledgeable attendants on duty to assist
							...{' '}
						</div>
					</div>
					<div className='arrow'> (>) </div>
				</div>
			</a>
		</Link>
		<style jsx>{`
			.callout {
				width: 25vw;
				height: 25vw;
				margin: 1.5vw;
				padding: 20px;
				box-sizing: border-box;
				background: var(--color-blue);
				margin-top: 0;
			}
			.large {
				font-size: 3em;
			}
			.bold {
				font-weight: bold;
			}
			.txt,
			.arrow {
				color: white;
			}
			.arrow {
				margin-top: 1.5vw;
			}
			@media screen and (max-width: 1001px) {
				.callout {
					width: 47.75vw;
					height: 47.75vw;
					margin-top: 1.5vw;
				}
			}
		`}</style>
	</div>
)

export default StoryCallout
