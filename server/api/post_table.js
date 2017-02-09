const db = require('../db/database.js')

module.exports = function(req, res) {

	const table_schema = db.get_table_schema(db.schema, req.params.table)
	const field_names  = db.get_field_names(table_schema).splice(1) // without first field (id)

	let params = []

	try {
		db.add_all_params(table_schema, req.body, params)
	} catch (err) {
		res.status(err.status).send(err.message)
		return
	}

	let sql = `INSERT INTO ${table_schema.name} (${field_names.join(',')}) VALUES (${field_names.map(() => '?').join(',')})`

	db.query(sql, params).then(
		(result) => res.status(200).send({ affected: result }),
		(err)    => res.status(500).send(err)
	)
}