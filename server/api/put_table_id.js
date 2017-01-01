const db = require('../db/database.js')

module.exports = function(req, res) {
	
	let sql         = `UPDATE ${req.params.table} SET WHERE id=@id`
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