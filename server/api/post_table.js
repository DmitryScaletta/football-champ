const db = require('../db/database.js')

function validate_field_type(value, type) {

	if (db.is_int_type(type) || db.is_bigint_type(type)) { return typeof value === 'number'  }
	if (db.is_nvarchar_type(type))                       { return typeof value === 'string'  }
	if (db.is_bit_type(type))                            { return value === 0 || value === 1 }

	return false
}	

module.exports = function(req, res) {

	const table_schema = db.get_table_schema(db.schema, req.params.table)
	const field_names  = db.get_field_names(table_schema).splice(1) // without first field (id)

	let params         = {}
	let param_types    = {}

	for (let field of table_schema.fields) {
		if (field.primary) continue

		// check required fields and default values
		let default_value
		if (field.required && req.body[field.name] === undefined) {
			res.status(400).send('Need all required fields')
			return
		} else
		if (field.default !== undefined) {
			default_value = field.default
		} 
		else {
			default_value = null
		}

		// check field type
		if (!validate_field_type(req.body[field.name], field.type)) {
			res.status(400).send('Wrong field type: ' + field.name)
			return
		}
		
		params     [field.name] = req.body[field.name] === undefined ? default_value : req.body[field.name]
		param_types[field.name] = field.type
	}

	// generate SQL query
	let sql = `INSERT INTO ${table_schema.name} (${field_names.join(',')}) VALUES (${field_names.map((field_name) => `@${field_name}`).join(',')})`

	// res.send(sql + '\n\n' + JSON.stringify(params) + '\n\n' + JSON.stringify(param_types))
	// return 

	// create object in database
	db.query(sql, params, param_types)
	.then((result) => {
		res.status(200).send({ affected: result.affected })
	})
	.catch((err) => {
		res.status(500).send(err.message)
	})
}