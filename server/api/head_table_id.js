const db = require('../db/database.js')

module.exports = function(req, res) {
	const table_schema = db.get_table_schema(db.schema, req.params.table)

	const sql = `SELECT id FROM ${table_schema.name}`

	db.query_select(sql).then(
		(result) => {
			if (!result.recordsets) {
				res.sendStatus(204)
			} else {
				res.sendStatus(200)
			}
		},
		(err) => res.status(500).send(err)
	)
}