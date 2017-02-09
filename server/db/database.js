const sqlite3 = require('sqlite3').verbose()
const db      = new sqlite3.Database('./data.sqlite3')
const schema  = require('./schema.js')


/*query_select('SELECT * FROM Line WHERE id=?', [1])
.then((result) => {
	console.log(result)
})
.catch((err) => {
	console.log(err)
})*/



/*
	Execute SELECT query and returns the result
	\param[in] string sql_query   SQL query
	\param[in] array  params      parameters list
	\returns   array              recordsets
*/
function query_select(sql_query, params = []) {

	return new Promise((resolve, reject) => {

		db.all(sql_query, params, (err, recordsets) => {
			if (err) {			
				reject(err)
				return
			}
			resolve(recordsets)
		})
	})
}

/*
	Execute INSERT, UPDATE or DELETE query
	\param[in] string sql_query   SQL query
	\param[in] array  params      parameters list
	\returns   number             number of affected rows
*/
function query(sql_query, params = []) {

	return new Promise((resolve, reject) => {

		db.run(sql_query, params, function(err) { // don't use arrow function here because this.lastID and this.changes doesn't work
			if (err) {
				reject(err)
				return
			}
			let result = 0
			if (this.lastID !== undefined) {
				// the value of the last inserted row ID (only INSERT)
				result = 1
			} else 
			if (this.changes !== undefined) {
				// number of rows affected by this query (only UPDATE or DELETE)
				result = this.changes
			}
			resolve(result)
		})
	})
}



function get_table_schema(db_schema, table_name) {
	for (let table of db_schema) {
		if (table.url === table_name) return table
	}
	return false
}

function get_field_names(table_schema) {
	let field_names = []
	for (let field of table_schema.fields) {
		field_names.push(field.name)
	}
	return field_names
}

function is_nvarchar_type(type) {
	return type.indexOf('NVARCHAR') !== -1
}

function is_number_type(type) {
	return type === 'INT' || type === 'BIGINT' || type === 'BIT'
}

function is_bit_type(type) {
	return type === 'BIT'
}

function is_int_type(type) {
	return type === 'INT'
}

function is_bigint_type(type) {
	return type === 'BIGINT'
}

function filter_to_where_array(filter, table_schema, params, use_short_name = false) {

	function get_field_from_table_schema(table_schema, field_name) {
		for (let field of table_schema.fields) {
			if (field.name === field_name) return field
		}
		return false
	}

	if (typeof filter !== 'object' || filter === null) throw { status: 400, message: 'Filter must be an object' }

	let where_array = []

	let keys = Object.keys(filter)
	for (let filter_field_name of keys) {

		let table_field = get_field_from_table_schema(table_schema, filter_field_name)

		if (!table_field) throw { 
			status: 400, 
			message: `No field "${filter_field_name}" in table "${table_schema.name}"`
		}


		let table_field_type = false
		if (is_number_type  (table_field.type)) { table_field_type = 'number' } else
		if (is_nvarchar_type(table_field.type)) { table_field_type = 'string' }

		if (!table_field_type) throw { status: 500, message: ''}


		let condition     = filter[filter_field_name]
		let sql_condition = ''
		
		const table_short_name = (use_short_name) ? table_schema.short_name + '.' : ''

		if (condition && typeof condition === 'object') {

			switch (condition.type) {
				// only string values
				case 'LIKE':
				case 'NOT LIKE': {
					if (table_field_type === 'number') {
						throw {
							status: 400,
							message: 'LIKE operator can\'t be used for numeric fields'
						}
					}

					if (typeof condition.value !== 'string') throw {
						status: 400,
						message: 'Value for LIKE operator must be a string'
					}

					sql_condition = `${table_short_name}${table_field.name} ${condition.type} ?`
					params.push(condition.value)
					break
				}

				// single value
				case '<>':
				case '>':
				case '<':
				case '>=':
				case '<=': {
					if (typeof condition.value !== table_field_type) throw { 
						status: 400, 
						message: 'Type of field and type of filter value must be the same'
					}

					sql_condition = `${table_short_name}${table_field.name}${condition.type}?`
					params.push(condition.value)
					break
				}

				// array of 2 values
				case 'BETWEEN':
				case 'NOT BETWEEN': {
					if (!Array.isArray(condition.value) || condition.value.length !== 2) throw {
						status: 400,
						message: 'Value for BETWEEN operator must be an array of 2 values'
					}

					if (typeof condition.value[0] !== table_field_type || typeof condition.value[1] !== table_field_type) throw {
						status: 400,
						message: 'Type of field and type of filter value must be the same'
					}

					sql_condition = `${table_short_name}${table_field.name} ${condition.type} ? AND ?`
					params.push(condition.value[0])
					params.push(condition.value[1])
					break
				}

				// array of 1 or more				
				case 'IN':
				case 'NOT IN': {
					if (!Array.isArray(condition.value) || condition.value.length < 1) throw {
						status: 400,
						message: 'Value for IN operator must be an array of 1 or more values'
					}

					for (const value of condition.value) {
						if (typeof value !== table_field_type) throw {
							status: 400,
							message: 'Type of field and type of filter value must be the same'
						}
						params.push(value)
					}

					sql_condition = `${table_short_name}${table_field.name} ${condition.type} (${condition.value.map(() => '?').join(',')})`
					break
				}

				// any field
				case 'IS NULL':
				case 'IS NOT NULL': {
					sql_condition = `${table_short_name}${table_field.name} ${condition.type}`
					break
				}

				default:
					throw { status: 400, message: 'Wrong condition type' }
			}
		} else {
			// = 
			if (typeof condition !== table_field_type) throw { 
				status: 400, 
				message: 'Type of field and type of filter value must be the same'
			}

			sql_condition = `${table_short_name}${table_field.name}=?`
			params.push(condition)
		}

		where_array.push(sql_condition)
	}

	return where_array
}

function add_all_params(table_schema, obj, params) {

	function validate_field_type(value, type) {

		if (is_int_type(type) || 
			is_bigint_type(type))   { return typeof value === 'number' || value === null }
		if (is_nvarchar_type(type)) { return typeof value === 'string' || value === null }
		if (is_bit_type(type))      { return typeof value === 'number' || value === false || value === true }

		return false
	}

	for (let field of table_schema.fields) {
		if (field.primary) continue

		// check required fields and default values
		let default_value
		if (field.required && obj[field.name] === undefined) {
			throw {
				status: 400,
				message: 'Need all required fields'
			}
		} else
		if (field.default !== undefined) {
			default_value = field.default
		} 
		else {
			default_value = null
		}

		// check field type
		if (obj[field.name] !== undefined && !validate_field_type(obj[field.name], field.type)) {
			throw {
				status: 400,
				message: `Wrong field type: ${field.name}`
			}
		}

		params.push((obj[field.name] === undefined) ? default_value : obj[field.name])
	}
}


module.exports.query                 = query
module.exports.query_select          = query_select
module.exports.schema                = schema

module.exports.get_table_schema      = get_table_schema
module.exports.get_field_names       = get_field_names
module.exports.filter_to_where_array = filter_to_where_array
module.exports.add_all_params        = add_all_params
