const db = require('../db/database.js')

module.exports = function(req, res) {
	const sql = `SELECT id FROM ${req.params.table}`

	db.query(sql)
	.then((result) => {
		if (!result.recordsets) {
			res.sendStatus(204)
		} else {
			res.sendStatus(200)
		}
	})
	.catch((err) => {
		console.log('Database Error:', err.message)
		res.sendStatus(500)
	})
}