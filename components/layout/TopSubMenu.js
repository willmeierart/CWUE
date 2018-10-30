import PropTypes from 'prop-types'
import { Link } from 'next-url-prettifier'
import { Router, routes } from '../../server/routes'
import ImperativeRouter from '../../server/ImperativeRouter'

const TopSubMenu = ({ url }) => {
	const route = routes.find((route) => {
		const matchVal = url.pathname === '/' ? 'index' : url.pathname.match(/[a-z]/g).join('')
		return route.page === matchVal
	})
	return (
		<div className='submenu-outer'>
			<ul>
				{route.children &&
					route.children.map((child) => (
						<li
							key={child.title}
							onClick={() => {
								ImperativeRouter.push(route.page, { title: child.title.toLowerCase().replace(' ', '-') }, false)
							}}
						>
							<span>{child.title}</span>
						</li>
					))}
			</ul>
			<style jsx>{`
				.submenu-outer {
					width: 80vw;
					left: 10vw;
					position: relative;
				}
				ul {
					width: 100%;
					display: flex;
					justify-content: space-between;
				}
				li {
					cursor: pointer;
				}
			`}</style>
		</div>
	)
}

TopSubMenu.propTypes = {
	url: PropTypes.object.isRequired
}

export default TopSubMenu
