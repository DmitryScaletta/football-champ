import React    from 'react'
import { Link } from 'react-router'
import Moment   from 'moment'

// style={{width: '50%'}}
const MatchesTable = ({ matches }) => {

	const rows = !matches ? null : matches.map((match) => {
		return (
			<tr key={match.id}>
				<td style={{width: '100px'}}>{Moment.unix(match.match_date).format('L')}</td>
				<td>
					<Link to={`/fc/${match.home_fc_id}`}>
						<img alt={match.home_fc_name} src={`/img/logos/small/${match.home_fc_image}`} />
						{' '}
						{match.home_fc_name}
					</Link>
				</td>
				<td style={{width: '45px', textAlign: 'center'}}>{match.score_home}-{match.score_away}</td>
				<td>
					<Link to={`/fc/${match.away_fc_id}`}>
						<img alt={match.away_fc_name} src={`/img/logos/small/${match.away_fc_image}`} />
						{' '}
						{match.away_fc_name}
					</Link>
				</td>
			</tr>
		)
	})

	return (
		<table className="table" >
			<tbody>
				{rows}
			</tbody>
		</table>
	)
}

MatchesTable.propTypes = {
	matches: React.PropTypes.any,
}

export default MatchesTable