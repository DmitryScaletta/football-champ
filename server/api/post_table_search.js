const db = require('../db/database.js')

module.exports = function(req, res) {

	const table_schema = db.get_table_schema(db.schema, req.params.table)
	const field_names  = db.get_field_names(table_schema)

	// filter
	let where_array = []
	let params      = {}
	let param_types = {}
	if (req.body.filter !== undefined) {
		try {
			where_array = db.filter_to_where_array(req.body.filter, table_schema, params, param_types)
		} catch (e) {
			res.status(e.status).send(e.message)
			return
		}
	}
	if (req.body.filter_or !== undefined) {
		try {
			const where_array_or = db.filter_to_where_array(req.body.filter_or, table_schema, params, param_types)
			where_array.push('(' + where_array_or.join(' OR ') + ')')
		} catch (e) {
			res.status(e.status).send(e.message)
			return
		}
	}

	// limit
	let limit_sql = ''
	if (typeof req.body.limit !== 'undefined') {
		if (typeof req.body.limit !== 'number' || req.body.limit <= 0) {
			res.status(400).send('Limit must be a number and greater than 0')
			return
		}
		limit_sql = `TOP ${req.body.limit} `
	}

	// order_by
	let order_by_sql = ''
	if (typeof req.body.order_by !== 'undefined') {
		if (!field_names.includes(req.body.order_by)) {
			res.status(400).send(`Table doesn\'t have field "${req.body.order_by}"`)
			return
		}
		order_by_sql = ' ORDER BY ' + req.body.order_by
		if (typeof req.body.order_type !== 'undefined') {
			if (req.body.order_type === 'ASC' || req.body.order_type === 'DESC') {
				order_by_sql += ' ' + req.body.order_type
			} else {
				res.status(400).send('Order type must be "ASC" or "DESC"')
				return
			}
		}
	}
	
	const SQL_SEARCH_CHAMP = 
	`SELECT ${limit_sql}
		Championat.id,
		Championat.name,
		Championat.country_id,
		co.name AS country_name,
		co.short_name AS country_short_name,
		s.id AS season_id,
		s.year_begin,
		s.year_end
	FROM Championat
	INNER JOIN Country AS co ON Championat.country_id=co.id
	FULL  JOIN Season AS s ON Championat.id=s.championat_id`
	
	const SQL_SEARCH_SEASON =
	`SELECT
		Season.id,
		Season.championat_id,
		ch.name AS championat_name,
		Season.year_begin,
		Season.year_end	
	FROM Season
	INNER JOIN Championat AS ch ON Season.championat_id=ch.id`

	const SQL_SEARCH_SEASON_FC =
	`SELECT
		SeasonFootballClub.id,
		SeasonFootballClub.season_id,
		ch.name AS championat_name,
		s.year_begin AS season_year_begin,
		s.year_end AS season_year_end,
		fc.id AS fc_id,
		fc.name AS fc_name,
		fc.image AS fc_image
	FROM SeasonFootballClub
	INNER JOIN FootballClub AS fc ON SeasonFootballClub.fc_id=fc.id
	INNER JOIN Season AS s ON SeasonFootballClub.season_id=s.id
	INNER JOIN Championat AS ch ON s.championat_id=ch.id`

	const SQL_SEARCH_FC = 
	`SELECT ${limit_sql}
		FootballClub.id,
		FootballClub.name,
		FootballClub.image,
		FootballClub.stadium_name,
		FootballClub.country_id,
		co.name AS country_name,
		co.short_name AS country_short_name,
		ci.name AS city_name
	FROM FootballClub
	INNER JOIN Country AS co ON FootballClub.country_id=co.id
	INNER JOIN City AS ci ON FootballClub.city_id=ci.id`
	
	const SQL_SEARCH_PLAYER =
	`SELECT ${limit_sql}
		Player.id,
		Player.name,
		Player.surname,
		Player.player_number,
		l.name AS line_name,
		l.short_name AS line_short_name,
		Player.country_id,
		co.name AS country_name,
		co.short_name AS country_short_name,
		Player.birth_date
	FROM Player
	INNER JOIN Line AS l ON Player.line_id=l.id
	FULL  JOIN Country AS co ON Player.country_id=co.id`
	
	const SQL_SEARCH_MATCH  = 
	`SELECT ${limit_sql}
		Match.id,
		home_fc_id,
		home_fc.name AS home_fc_name,
		home_fc.image AS home_fc_image,
		away_fc_id, 
		away_fc.name AS away_fc_name,
		away_fc.image AS away_fc_image,
		Match.score_home, 
		Match.score_away,
		Match.match_date,
		Match.is_over
	FROM Match
	FULL JOIN FootballClub AS home_fc ON Match.home_fc_id=home_fc.id
	FULL JOIN FootballClub AS away_fc ON Match.away_fc_id=away_fc.id`

	const SQL_SEARCH_CITY  = 
	`SELECT ${limit_sql}
		City.id,
		City.name,
		City.country_id,
		co.name AS country_name,
		co.short_name AS country_short_name
	FROM City
	INNER JOIN Country AS co ON City.country_id=co.id`

	let sql = ''

	switch (req.params.table) {
		case 'championat': { sql = SQL_SEARCH_CHAMP     } break
		case 'season':     { sql = SQL_SEARCH_SEASON    } break
		case 'season-fc':  { sql = SQL_SEARCH_SEASON_FC } break
		case 'fc':         { sql = SQL_SEARCH_FC        } break
		case 'player':     { sql = SQL_SEARCH_PLAYER    } break
		case 'match':      { sql = SQL_SEARCH_MATCH     } break
		case 'city':       { sql = SQL_SEARCH_CITY      } break

		default:
			sql = `SELECT ${limit_sql}${field_names.join(',')} FROM ${table_schema.name}`
			break
	}

	if (where_array.length > 0) sql += ` WHERE ${where_array.join(' AND ')}`

	sql += order_by_sql

	db.query(sql, params, param_types)
	.then((result) => {
		if (result.recordsets.length === 0) {
			res.send([])
			return
		} 
		if (req.params.table === 'championat') {
			let champs = {}
			for (const champ of result.recordsets) {
				if (champs[champ.id] === undefined){
					champs[champ.id] = {
						id: champ.id,
						name: champ.name,
						country_id: champ.country_id,
						country_name: champ.country_name,
						country_short_name: champ.country_short_name,
						seasons: []
					}
				}
				const season = {
					season_id: champ.season_id,
					year_begin: champ.year_begin,
					year_end:  champ.year_end
				}
				champs[champ.id].seasons.push(season)
			}
			champs = Object.keys(champs).map((key) => champs[key])
			res.send(champs)
		} else {
			res.send(result.recordsets)
		}

	})
	.catch((err) => {
		console.log('Database Error:', err.message)
		res.sendStatus(500)
	})
}