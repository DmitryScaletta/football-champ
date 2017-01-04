const db = require('../db/database.js')

module.exports = function(req, res) {
	const table_schema = db.get_table_schema(db.schema, req.params.table)
	const field_names  = db.get_field_names(table_schema)

	const SQL_SELECT_FC =
	`SELECT
		fc.id,
		fc.name,
		fc.name_eng,
		fc.image,
		fc.country_id,
		co.name AS country_name,
		co.short_name AS country_short_name,
		fc.city_id,
		ci.name AS city_name,
		fc.full_name,
		fc.foundation_year,
		fc.stadium_name,
		fc.trainer_id,
		t.name AS trainer_name,
		t.surname AS trainer_surname,
		fc.site,
		fc.colors,
		fc.previous_names
	FROM FootballClub AS fc
	INNER JOIN Country AS co ON fc.country_id=co.id
	FULL  JOIN City    AS ci ON fc.city_id=ci.id
	FULL  JOIN Trainer AS t  ON fc.trainer_id=t.id
	
	WHERE fc.id=@id`

	const SQL_SELECT_PLAYER =
	`SELECT
		p.id,
		p.name,
		p.surname,
		p.name_eng,
		p.surname_eng,
		p.fc_id,
		fc.name AS fc_name,
		fc.image AS fc_image,
		p.country_id,
		co.name AS country_name,
		co.short_name AS country_short_name,
		p.birth_date,
		p.player_number,
		p.line_id,
		l.name AS line_name,
		l.short_name AS line_short_name,
		p.weight,
		p.growth
	FROM Player AS p
	FULL JOIN FootballClub AS fc ON p.fc_id=fc.id
	INNER JOIN Line AS l ON p.line_id=l.id
	FULL JOIN Country AS co ON p.country_id=co.id
	WHERE p.id=@id`

	const SQL_SELECT_MATCH =
	`SELECT
		m.id,
		m.season_id,
		s.championat_id,
		ch.name AS championat_name,
		ch.country_id AS championat_country_id,
		co.short_name AS championat_country_short_name,
		s.year_begin AS season_year_begin,
		s.year_end AS season_year_end,
		m.home_fc_id,
		home_fc.name AS home_fc_name,
		home_fc.image AS home_fc_image,
		home_fc.stadium_name,
		m.away_fc_id,
		away_fc.name AS away_fc_name,
		away_fc.image AS away_fc_image,
		m.tour,
		m.score_home,
		m.score_away,
		m.match_date,
		m.is_over
	FROM Match AS m
	INNER JOIN Season AS s ON m.season_id=s.id
	INNER JOIN Championat AS ch ON s.championat_id=ch.id
	FULL  JOIN Country AS co ON ch.country_id=co.id
	INNER JOIN FootballClub AS home_fc ON m.home_fc_id=home_fc.id
	INNER JOIN FootballClub AS away_fc ON m.away_fc_id=away_fc.id
	WHERE m.id=@id`

	let   sql          = ''
	const params       = { id: req.params.id }
	const param_types  = { id: 'number' }

	switch (req.params.table) {
		case 'fc':     { sql = SQL_SELECT_FC     } break
		case 'player': { sql = SQL_SELECT_PLAYER } break
		case 'match':  { sql = SQL_SELECT_MATCH  } break

		default:
			sql = `SELECT ${field_names.join(',')} FROM ${table_schema.name} WHERE id=@id`
	}

	db.query(sql, params, param_types)
	.then((result) => {
		if (!result.recordsets || !result.recordsets[0]) {
			res.send({})
		} else {
			res.send(result.recordsets[0])
		}
	})
	.catch((err) => {
		console.log('Database Error:', err.message)
		res.sendStatus(500)
	})
}