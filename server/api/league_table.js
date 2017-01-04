const db = require('../db/database.js')

module.exports = function(req, res) {
	const params      = { season_id: req.params.season_id }
	const param_types = { season_id: 'number' }

	Promise.all([
		db.stored_procedure('get_completed_matches', params, param_types),
		db.stored_procedure('get_football_clubs',    params, param_types),
	])
	.then((results) => {
		const completed_matches = results[0][0]
		const football_clubs    = results[1][0]

		let league_table = {}
		for (const fc of football_clubs) {
			league_table[fc.id] = {
				id:            fc.id,
				name:          fc.name,
				image:         fc.image,
				games_count:   0,
				games_won:     0,
				games_draw:    0,
				games_lost:    0,
				goals_scored:  0,
				goals_against: 0,
				points:        0
			}
		}

		for (const match of completed_matches) {
			// games count
			league_table[match.home_fc_id].games_count++
			league_table[match.away_fc_id].games_count++

			// won or lost
			if (match.score_home > match.score_away) {
				league_table[match.home_fc_id].games_won++
				league_table[match.away_fc_id].games_lost++
				league_table[match.home_fc_id].points += 3
			} else
			if (match.score_home < match.score_away) {
				league_table[match.home_fc_id].games_lost++
				league_table[match.away_fc_id].games_won++
				league_table[match.away_fc_id].points += 3
			} else {
				league_table[match.home_fc_id].games_draw++
				league_table[match.away_fc_id].games_draw++
				league_table[match.home_fc_id].points += 1
				league_table[match.away_fc_id].points += 1
			}

			// goals
			league_table[match.home_fc_id].goals_scored  += match.score_home
			league_table[match.home_fc_id].goals_against += match.score_away
			league_table[match.away_fc_id].goals_scored  += match.score_away
			league_table[match.away_fc_id].goals_against += match.score_home
		}

		// object to array
		league_table = Object.keys(league_table).map((key) => league_table[key])

		// sorting
		league_table.sort((a, b) => {
			// by points
			if (a.points > b.points) return -1
			if (a.points < b.points) return 1

			// by goals difference
			if ((a.goals_scored - a.goals_against) > (b.goals_scored - b.goals_against)) return -1
			if ((a.goals_scored - a.goals_against) < (b.goals_scored - b.goals_against)) return 1
			
			// by name
			if (a.name > b.name) return -1
			if (a.name < b.name) return 1

			return 0
		})

		res.send(league_table)
	}).catch((err) => {
		res.status(500).send(err.message)
	})
}