import React    from 'react'
import { Link } from 'react-router'

const LeagueTable = ({ fcs }) => {

	let i = 0
	const rows = !fcs ? null : fcs.map((fc) => {
		i++
		return (
			<tr key={i}>
				<td>{i}</td>
				<td>
					<Link to={`/fc/${fc.id}`}>
						<img alt={fc.name} src={`/img/logos/small/${fc.image}`} />
						{' '}
						{fc.name}
					</Link>
				</td>
				<td>{fc.games_count}</td>
				<td>{fc.games_won}</td>
				<td>{fc.games_draw}</td>
				<td>{fc.games_lost}</td>
				<td>{fc.goals_scored} - {fc.goals_against}</td>
				<td>{fc.points}</td>
			</tr>
		)
	})

	return (
		<table className="table" >
			<thead>
				<tr>
					<th>#</th>
					<th>Название</th>
					<th>И</th>
					<th>В</th>
					<th>Н</th>
					<th>П</th>
					<th>Г</th>
					<th>О</th>
				</tr>
			</thead>
			<tbody>
				{rows}
			</tbody>
		</table>
	)
}

LeagueTable.propTypes = {
	fcs: React.PropTypes.array,
}

export default LeagueTable