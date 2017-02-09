const db = require('../db/database.js')

module.exports = function(req, res) {

	const table_schema = db.get_table_schema(db.schema, req.params.table)
	const field_names  = db.get_field_names(table_schema)

	// filter
	let where_array = []
	let params      = []

	if (req.body.filter !== undefined) {
		try {
			where_array = db.filter_to_where_array(req.body.filter, table_schema, params, true)
		} catch (e) {
			res.status(e.status).send(e.message)
			return
		}
	}
	if (req.body.filter_or !== undefined) {
		try {
			const where_array_or = db.filter_to_where_array(req.body.filter_or, table_schema, params, true)
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
		limit_sql = `LIMIT ${req.body.limit}`
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
	`SELECT
		ch.id,
		ch.name,
		ch.country_id,
		co.name AS country_name,
		co.short_name AS country_short_name,
		s.id AS season_id,
		s.year_begin,
		s.year_end
	FROM Championat AS ch
	INNER JOIN Country AS co ON ch.country_id=co.id
	INNER JOIN Season  AS s  ON ch.id=s.championat_id`
	
	const SQL_SEARCH_SEASON =
	`SELECT
		s.id,
		s.championat_id,
		ch.name AS championat_name,
		s.year_begin,
		s.year_end	
	FROM Season AS s
	INNER JOIN Championat AS ch ON s.championat_id=ch.id`

	const SQL_SEARCH_SEASON_FC =
	`SELECT
		sfc.id,
		sfc.season_id,
		ch.name AS championat_name,
		s.year_begin AS season_year_begin,
		s.year_end AS season_year_end,
		fc.id AS fc_id,
		fc.name AS fc_name,
		fc.image AS fc_image
	FROM SeasonFootballClub AS sfc
	INNER JOIN FootballClub AS fc ON sfc.fc_id=fc.id
	INNER JOIN Season       AS s  ON sfc.season_id=s.id
	INNER JOIN Championat   AS ch ON s.championat_id=ch.id`

	const SQL_SEARCH_FC = 
	`SELECT
		fc.id,
		fc.name,
		fc.image,
		fc.stadium_name,
		fc.country_id,
		co.name AS country_name,
		co.short_name AS country_short_name,
		ci.name AS city_name
	FROM FootballClub AS fc
	INNER JOIN Country AS co ON fc.country_id=co.id
	INNER JOIN City    AS ci ON fc.city_id=ci.id`
	
	const SQL_SEARCH_PLAYER =
	`SELECT
		p.id,
		p.name,
		p.surname,
		p.player_number,
		l.name AS line_name,
		l.short_name AS line_short_name,
		p.country_id,
		co.name AS country_name,
		co.short_name AS country_short_name,
		p.birth_date
	FROM Player AS p
	INNER JOIN Line    AS l  ON p.line_id=l.id
	INNER JOIN Country AS co ON p.country_id=co.id`
	
	const SQL_SEARCH_MATCH  = 
	`SELECT
		m.id,
		home_fc_id,
		home_fc.name AS home_fc_name,
		home_fc.image AS home_fc_image,
		away_fc_id, 
		away_fc.name AS away_fc_name,
		away_fc.image AS away_fc_image,
		m.score_home, 
		m.score_away,
		m.match_date,
		m.is_over
	FROM Match AS m
	INNER JOIN FootballClub AS home_fc ON m.home_fc_id=home_fc.id
	INNER JOIN FootballClub AS away_fc ON m.away_fc_id=away_fc.id`

	const SQL_SEARCH_CITY  = 
	`SELECT
		ci.id,
		ci.name,
		ci.country_id,
		co.name AS country_name,
		co.short_name AS country_short_name
	FROM City AS ci
	INNER JOIN Country AS co ON ci.country_id=co.id`

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
			sql = `SELECT ${field_names.join(',')} FROM ${table_schema.name} AS ${table_schema.short_name}`
			break
	}

	if (where_array.length > 0) sql += ` WHERE ${where_array.join(' AND ')}`

	sql += `${order_by_sql} ${limit_sql}`

	function add_seasons_to_championats(championats) {
		let champs = {}
		for (const champ of championats) {
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
				season_id:  champ.season_id,
				year_begin: champ.year_begin,
				year_end:   champ.year_end
			}
			champs[champ.id].seasons.push(season)
		}
		return Object.keys(champs).map((key) => champs[key])
	}

	db.query_select(sql, params)
	.then((result) => {
		if (result.length === 0) {
			res.send([])
			return
		} 
		if (req.params.table === 'championat') {
			const champs = add_seasons_to_championats(result)
			res.send(champs)
		} else {
			res.send(result)
		}
	},
	(err) => res.status(500).send(err))
}