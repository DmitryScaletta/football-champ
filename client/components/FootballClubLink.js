import React    from 'react'
import { Link } from 'react-router'

const FootballClubLink = ({id, name, image}) => (
	<Link to={`/fc/${id}`}>
		<img alt={name} src={`/img/logos/small/${image}`} />
		{' '}
		{name}
	</Link>
)

FootballClubLink.propTypes = {
	id:    React.PropTypes.number,
	name:  React.PropTypes.string,
	image: React.PropTypes.string,
}

export default FootballClubLink