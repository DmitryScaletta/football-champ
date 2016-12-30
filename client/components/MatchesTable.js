import React            from 'react'
import { Link }         from 'react-router'
import Moment           from 'moment'
import FootballClubLink from './FootballClubLink'


const MatchesTable = ({ matches }) => {

	Moment.locale('ru')
	const rows = !matches ? null : matches.map((match) => {
		return (
			<tr key={match.id}>
				<td style={{width: '16%'}}>
					<Link to={`/match/${match.id}`}>
						{Moment.unix(match.match_date).format('L')}
					</Link>
				</td>
				<td style={{width: '38%'}}>
					<FootballClubLink id={match.home_fc_id} name={match.home_fc_name} image={match.home_fc_image} />
				</td>
				<td style={{width: '8%', textAlign: 'center'}}>{match.score_home}-{match.score_away}</td>
				<td style={{width: '38%'}}>
					<FootballClubLink id={match.away_fc_id} name={match.away_fc_name} image={match.away_fc_image} />
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