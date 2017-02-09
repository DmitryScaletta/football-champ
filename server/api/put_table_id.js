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

	params.push(Number(req.params.id))

	let sql = `UPDATE ${table_schema.name} SET ${field_names.map((field) => `${field}=?`).join(',')} WHERE id=?`

	db.query(sql, params).then(
		(result) => res.status(200).send({ affected: result }),
		(err)    => res.status(500).send(err)
	)
}