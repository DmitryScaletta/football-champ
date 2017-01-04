const db = require('../db/database.js')

module.exports = function(req, res) {
	const table_schema = db.get_table_schema(db.schema, req.params.table)

	let sql         = `DELETE FROM ${table_schema.name} WHERE id=@id`
	let params      = { id: Number(req.params.id) }
	let param_types = { id: 'number' }

	db.query(sql, params, param_types)
	.then((result) => {
		res.status(200).send({ affected: result.affected })
	})
	.catch((err) => {
		res.status(500).send(err.message)
	})
}