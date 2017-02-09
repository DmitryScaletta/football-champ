const db = require('../db/database.js')

module.exports = function(req, res) {
	
	// res.send([])
	
	const params = [ Number(req.params.season_id) ]
	
	const SELECT_COMPLETED_MATCHES = 
	`SELECT 
		home_fc_id,
		home_fc.name AS home_fc_name,
		away_fc_id, 
		away_fc.name AS away_fc_name,
		m.score_home, 
		m.score_away
	FROM Match AS m 
	INNER JOIN FootballClub AS home_fc ON m.home_fc_id=home_fc.id
	INNER JOIN FootballClub AS away_fc ON m.away_fc_id=away_fc.id
	WHERE season_id=? AND is_over=1`

	const SELECT_FOOTBALL_CLUBS =
	`SELECT
		fc.id,
		fc.name,
		fc.image
	FROM SeasonFootballClub AS sfc
	INNER JOIN FootballClub AS fc ON sfc.fc_id=fc.id
	WHERE season_id=?`

	Promise.all([
		db.query_select(SELECT_COMPLETED_MATCHES, params),
		db.query_select(SELECT_FOOTBALL_CLUBS,    params),
	]).then((results) => {

		const completed_matches = results[0]
		const football_clubs    = results[1]

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
	},
	(err) => res.status(500).send(err.message))
}