const db = require('../db/database.js')

module.exports = function(req, res) {
	
	const table_schema = db.get_table_schema(db.schema, req.params.table)
	const field_names  = db.get_field_names(table_schema).splice(1) // without first field (id)

	let where_array    = []
	let params         = {}
	let param_types    = {}

	try {
		db.add_all_params(table_schema, req.body.data, params, param_types)
	} catch (err) {
		res.status(err.status).send(err.message)
		return
	}

	if (req.body.filter !== undefined) {
		try {
			where_array = db.filter_to_where_array(req.body.filter, table_schema, params, param_types)
		} catch (e) {
			res.status(e.status).send(e.message)
			return
		}
	}

	// generate SQL query
	let sql = `UPDATE ${table_schema.name} SET ${field_names.map((field_name) => `${field_name}=@${field_name}${db.DATA_POSTFIX}`).join(',')}`

	if (where_array.length > 0) sql += ` WHERE ${where_array.join(' AND ')}`

	// create object in database
	db.query(sql, params, param_types)
	.then((result) => {
		res.status(200).send({ affected: result.affected })
	})
	.catch((err) => {
		res.status(500).send(err.message)
	})
}