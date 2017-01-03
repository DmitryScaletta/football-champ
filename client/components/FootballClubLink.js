import React    from 'react'
import { Link } from 'react-router'

const FootballClubLink = ({id = null, name, image}) => (
	<Link to={(id) ? `/fc/${id}` : null}>
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