import React    from 'react'
import { Link } from 'react-router'
import FlagLink from './FlagLink'
import DateTime from './DateTime'

const PlayersTableExtended = ({ players }) => {

	const rows = !players ? null : players.map((player) => {
		return (
			<tr key={player.id}>
				<td>{player.player_number}</td>
				<td>
					<Link to={`/player/${player.id}`}>{player.name} {player.surname}</Link>
				</td>
				<td>
					<FlagLink title={player.country_name} flag={player.country_short_name} />
				</td>
				<td>
					<DateTime timestamp={player.birth_date} format={'L'} years={true} />
				</td>
				<td>{player.line_short_name}</td>
			</tr>
		)
	})

	return (
		<table className="table" >
			<thead>
				<tr>
					<th>#</th>
					<th>Игрок</th>
					<th>Гражданство</th>
					<th>Дата рождения</th>
					<th>Амплуа</th>
				</tr>
			</thead>
			<tbody>
				{rows}
			</tbody>
		</table>
	)
}

PlayersTableExtended.propTypes = {
	players: React.PropTypes.any,
}

export default PlayersTableExtended