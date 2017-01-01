const db = require('../db/database.js')

module.exports = function(req, res) {
	
	const table_schema = db.get_table_schema(db.schema, req.params.table)
	const field_names  = db.get_field_names(table_schema).splice(1) // without first field (id)

	let params         = {}
	let param_types    = {}

	try {
		db.add_all_params(table_schema, req.body, params, param_types)
	} catch (err) {
		res.status(err.status).send(err.message)
		return
	}

	params     ['id'] = Number(req.params.id)
	param_types['id'] = 'number'

	// generate SQL query
	let sql = `UPDATE ${table_schema.name} SET ${field_names.map((field) => `${field}=@${field}${db.DATA_POSTFIX}`).join(',')} WHERE id=@id`

	// create object in database
	db.query(sql, params, param_types)
	.then((result) => {
		res.status(200).send({ affected: result.affected })
	})
	.catch((err) => {
		res.status(500).send(err.message)
	})
}