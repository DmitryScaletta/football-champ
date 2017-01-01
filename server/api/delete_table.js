const db = require('../db/database.js')

module.exports = function(req, res) {
	
	const table_schema = db.get_table_schema(db.schema, req.params.table)

	let sql            = ''
	let params         = {}
	let param_types    = {}
	let where_array    = []

	if (req.body.filter !== undefined) {
		try {
			where_array = db.filter_to_where_array(req.body.filter, table_schema, params, param_types)
		} catch (e) {
			res.status(e.status).send(e.message)
			return
		}
	}

	sql = `DELETE FROM ${req.params.table}`

	if (where_array.length > 0) sql += ` WHERE ${where_array.join(' AND ')}`

	db.query(sql, params, param_types)
	.then((result) => {
		res.status(200).send({ affected: result.affected })
	})
	.catch((err) => {
		res.status(500).send(err.message)
	})
}