import React    from 'react'
import { Link } from 'react-router'

const FlagLink = ({className, onClick, to = null, title, flag}) => (
	<Link className={className} to={to} onClick={onClick}>
		{ !flag ? null : <img style={{border: '1px solid #ccc'}} alt={title} src={`/img/flags/${flag}.png`} /> }
		{' '}
		{title}
	</Link>
)

FlagLink.propTypes = {
	className: React.PropTypes.string,
	to:        React.PropTypes.string,
	title:     React.PropTypes.string,
	flag:      React.PropTypes.string,
}

export default FlagLink