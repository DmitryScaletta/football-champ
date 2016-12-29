import React    from 'react'
import { Link } from 'react-router'


const FootballClubTable = ({ fcs }) => {

	const rows = !fcs ? null : fcs.map((fc) => {
		return (
			<tr key={fc.id}>
				<td>
					<Link to={`/fc/${fc.id}`}>
						<img alt={fc.name} src={`/img/logos/small/${fc.image}`} />
						{' '}
						{fc.name}
					</Link>
				</td>
				<td>
					<img className="country-flag" alt={fc.country_name} src={`/img/flags/${fc.country_short_name}.png`} />
					{' '}
					{fc.country_name}
				</td>
				<td>{fc.city_name}</td>
				<td>{fc.stadium_name}</td>
			</tr>
		)
	})

	return (
		<table className="table">
			<thead>
				<tr>
					<th>Название</th>
					<th>Страна</th>
					<th>Город</th>
					<th>Стадион</th>
				</tr>
			</thead>
			<tbody>
				{rows}
			</tbody>
		</table>
	)

}

FootballClubTable.propTypes = {
	fcs: React.PropTypes.array,
}

export default FootballClubTable