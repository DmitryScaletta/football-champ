const db = require('../db/database.js')

module.exports = function(req, res) {
	const table_schema = db.get_table_schema(db.schema, req.params.table)

	const sql    = `DELETE FROM ${table_schema.name} WHERE id=?`
	const params = [ Number(req.params.id) ]

	db.query(sql, params).then(
		(result) => res.status(200).send({ affected: result }),
		(err)    => res.status(500).send(err)
	)
}