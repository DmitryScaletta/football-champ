import React    from 'react'
import { Link } from 'react-router'

const FlagLink = ({to = null, title, flag}) => (
	<Link to={to}>
		{ !flag ? null : <img style={{border: '1px solid #ccc'}} alt={title} src={`/img/flags/${flag}.png`} /> }
		{' '}
		{title}
	</Link>
)

FlagLink.propTypes = {
	to:    React.PropTypes.string,
	title: React.PropTypes.string,
	flag:  React.PropTypes.string,
}

export default FlagLink