import React    from 'react'
import { Link } from 'react-router'

const PlayersTable = ({ players }) => {

	const rows = !players ? null : players.map((player) => {
		return (
			<tr key={player.id}>
				<td>{player.player_number}</td>
				<td>
					<Link to={`/player/${player.id}`}>{player.name} {player.surname}</Link>
				</td>
				<td>{player.line_name}</td>
			</tr>
		)
	})

	return (
		<table className="table" >
			<thead>
				<tr>
					<th>#</th>
					<th>Игрок</th>
					<th>Амплуа</th>
				</tr>
			</thead>
			<tbody>
				{rows}
			</tbody>
		</table>
	)
}

PlayersTable.propTypes = {
	players: React.PropTypes.any,
}

export default PlayersTable