const express           = require('express')
const path              = require('path')
const body_parser       = require('body-parser')

const db                = require('./db/database.js')
const league_table      = require('./api/league_table.js')
const post_table_search = require('./api/post_table_search.js')
const get_table_id      = require('./api/get_table_id.js')
const head_table_id     = require('./api/head_table_id.js')
const post_table        = require('./api/post_table.js')
const put_table         = require('./api/put_table.js')
const put_table_id      = require('./api/put_table_id.js')
const delete_table      = require('./api/delete_table.js')
const delete_table_id   = require('./api/delete_table_id.js')

const app = express()
db.connect()

app.disable('x-powered-by')
app.use(express.static(path.join(__dirname, './static')))
app.use(body_parser.json()) // for parsing application/json

/*
|--------|-------------------|---------------------------------------|
| Method | URL               | Description                           |
|--------|-------------------|---------------------------------------|
| GET    | /league_table/:id | Get league tabe by season_id          |
|--------|-------------------|---------------------------------------|
| POST   | /:table/search    | Get all objects by filter             |
|--------|-------------------|---------------------------------------|
| GET    | /:table/:id       | Get object by id                      |
|--------|-------------------|---------------------------------------|
| HEAD   | /:table/:id       | Is object exists                      |
|--------|-------------------|---------------------------------------|
| POST   | /:table           | Create new object and add to database |
|--------|-------------------|---------------------------------------|
| PUT    | /:table           | Update all objects by filter          |
|--------|-------------------|---------------------------------------|
| PUT    | /:table/:id       | Update object by id                   |
|--------|-------------------|---------------------------------------|
| DELETE | /:table           | Delete all objects by filter          |
|--------|-------------------|---------------------------------------|
| DELETE | /:table/:id       | Delete object by id                   |
|--------|-------------------|---------------------------------------|
*/



function validate_table_name_middleware(req, res, next) {
	
	function is_valid_table_name(db_schema, table_name) {
		for (let table of db_schema) {
			if (table.url === table_name) return true
		}
		return false
	}

	if (is_valid_table_name(db.schema, req.params.table)) {
		next()	
	} else {
		res.status(400).send('Invalid table name')
	}
}

function validate_id_middleware(req, res, next) {

	if (isNaN(req.params.id)) {
		res.status(400).send('Id is not a number')
		return
	}
	
	req.params.id = Number(req.params.id)
	
	if (req.params.id <= 0) {
		res.status(400).send('Id must be greater than 0')
		return
	}

	next()
}



/*
	Responses for all methods:
		200 OK
		204 No Content
		400 Bad Request
		500 Internal Server Error

	Filter example:

		"filter": {
			"name":       "Алексис",
			"fc_id":      { "type": "=",       "value": [1, 2]       },
			"weight":     { "type": "<=",      "value": 80           },
			"surname":    { "type": "LIKE",    "value": "Сан%"       },
			"fc_id":      { "type": "IN",      "value": [ 1, 2, 3 ]  },
			"growth":     { "type": "BETWEEN", "value": [ 180, 200 ] },
			"country_id": { "type": "IS NULL" }
		},
		"filter_or": {
			"home_fc_id": 2,
			"away_fc_id": 2
		}
*/



app.get('/api/league_table/:season_id', league_table)

app.all('/api/:table',        validate_table_name_middleware)
app.all('/api/:table/search', validate_table_name_middleware)

/*
	Get all objects by filter
	method: POST
	request:
		filter   {object} - conditions list
		order_by {string} - order
		limit    {number} - limit of returned objects
	responses:
		200 OK            - success
			[]   {array}  - array of objects
		204 No Content    - no matches
*/
app.post('/api/:table/search', post_table_search)

app.all('/api/:table/:id', validate_table_name_middleware, validate_id_middleware)

/*
	Get object by id
	method: GET
	request: -
	responses:
		200 OK          - success
			{} {object} - returned object
		204 No Content  - object doesn't exist
*/
app.get('/api/:table/:id', get_table_id)

/*
	Is object exists
	method: HEAD
	request: -
	responses: 
		200 OK         - object exist
		204 No Content - object doesn't exist
*/
app.head('/api/:table/:id', head_table_id)

/*
	Create new object and add to the database
	method: POST
	request:
		data {object} - object for adding
	response:
		200 OK        - object created successfully
*/
app.post('/api/:table', post_table)

/*
	Update all objects by filter
	method: PUT
	request:
		data         {object} - object with new values for some fields
		filter       {object} - filter
	response:
		200 OK                - all objects updated successfully
			affected {number} - count of updated objects
		204 No Content        - no objects found matching
*/
app.put('/api/:table', put_table)

/*
	Update object by id
	method:   PUT
	request:
		{} {object}           - new object for updating
	response:
		200 OK                - object updated successfully
			affected {number} - count of updated objects
		204 No Content        - object doesn't exist
*/
app.put('/api/:table/:id', put_table_id)

/*
	Delete all objects by filter
	method: DELETE
	request:
		filter       {object} - array of conditions
	responses:
		200 OK                - objects deleted successfully
			affected {number} - count of deleted objects
		204 No Content        - no objects found matching
*/
app.delete('/api/:table', delete_table)

/* 
	Delete object by id
	method: DELETE
	request: -
	response:
		200 OK                - object deleted successfully
			affected {number} - count of deleted objects
		204 No Content        - object doesn't exist
*/
app.delete('/api/:table/:id', delete_table_id)



app.get('*', (req, res) => {
	res.sendStatus(404)
})

app.listen(3000, () => {
	console.log('Football Champ app listening on port 3000!')
})
