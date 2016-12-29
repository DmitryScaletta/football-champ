import React            from 'react'
import { Link }         from 'react-router'
import FootballClubLink from '../components/FootballClubLink'
import FlagLink         from '../components/FlagLink'


const FootballClubTable = ({ fcs }) => {

	const rows = !fcs ? null : fcs.map((fc) => {
		return (
			<tr key={fc.id}>
				<td>
					<FootballClubLink id={fc.id} name={fc.name} image={fc.image} />
				</td>
				<td>
					<FlagLink title={fc.country_name} flag={fc.country_short_name} />
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