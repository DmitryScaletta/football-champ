// const co  = require('co')
const sql       = require('mssql')
const db_config = require('../db_config.js')
const schema    = require('./schema.js')

let connection = false



function connect() {

	return new Promise((resolve, reject) => {		

		if (!connection || !connection.connected) {
			
			console.time('Connect to database')
			connection = sql.connect(db_config, (err) => {
				if (err) {
					reject(err)
				} else {
					console.timeEnd('Connect to database')
				}

				resolve()
			})
		} else {
			resolve()
		}
	})
}

// set param types for request or stmt object
function set_param_types_for_request(request, param_types, params = false) {

	if (typeof param_types !== 'object') return true

	const keys = Object.keys(param_types)
	for (let key of keys) {

		const regex = /^NVARCHAR\((\d+)\)$/
		
		let type = false
		let m
		
		if (param_types[key] === 'INT')                  { type = sql.Int      } else
		if (param_types[key] === 'BIGINT')               { type = sql.BigInt   } else
		if (param_types[key] === 'BIT')                  { type = sql.Bit      } else
		if (param_types[key] === 'string')               { type = sql.NVarChar } else
		if (param_types[key] === 'number')               { type = sql.BigInt   } else
		if ((m = regex.exec(param_types[key])) !== null) { type = sql.NVarChar(Number(m[1])) }

		if (!type) return false

		if (params) {
			// for stored procedure
			request.input(key, type, params[key])
		} else {
			// for prepared statement
			request.input(key, type)
		}
	}
	
	return true
}

/*
	Execute SQL query and returns the result
	\param[in] string sql_query   SQL query
	\param[in] object params      parameters list
	\param[in] object param_types parameter types list
	\returns   object { recordsets, affected }
*/
function query(sql_query, params, param_types) {

	return new Promise((resolve, reject) => {

		connect()
		.then(() => {
			const stmt = new sql.PreparedStatement(connection)

			// set parameter types
			if (!set_param_types_for_request(stmt, param_types)) {
				reject({ message: 'Field type is not specified' })
				return
			}

			// prepare and execute statement
			stmt.prepare(sql_query, (err) => {
				if (err) {
					reject(err)
					return
				}

				stmt.execute(params, (err, recordsets, affected) => {
					if (err) {
						reject(err)
						return
					}

					resolve({
						recordsets,
						affected
					})

					stmt.unprepare((err) => {
						if (err) reject(err)
					})
				})
				
			})

		})
		.catch((err) => {
			reject(err)
		})

	})
}

/*
	Execute stored procedure and returns the result
	\param[in] string procedure_name name of stored procedure
	\param[in] object params         parameters list
	\param[in] object param_types    parameter types list
	\returns   object recordset
*/
function stored_procedure(procedure_name, params, param_types) {

	return new Promise((resolve, reject) => {
		connect()
		.then(() => {
			const request = new sql.Request()

			if (!set_param_types_for_request(request, param_types, params)) {
				reject({ message: 'Field type is not specified' })
				return
			}

			request.execute(procedure_name)
			.then((recordsets) => {
				resolve(recordsets)
			})
			.catch((err) => {
				reject(err)
			})
		}).catch((err) => {
			reject(err)
		})
	})

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

function filter_to_where_array(filter, table_schema, params, param_types) {

	function get_field_from_table_schema(table_schema, field_name) {
		for (let field of table_schema.fields) {
			if (field.name === field_name) return field
		}
		return false
	}

	if (typeof filter !== 'object') throw { status: 400, message: 'Filter must be an object' }

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
		
		if (typeof condition === 'object') {

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

					sql_condition = `${table_schema.name}.${table_field.name} ${condition.type} @${table_field.name}`
					params     [table_field.name] = condition.value
					param_types[table_field.name] = 'string'
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

					sql_condition = `${table_schema.name}.${table_field.name}${condition.type}@${table_field.name}`
					params     [table_field.name] = condition.value
					param_types[table_field.name] = table_field_type
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

					sql_condition = `${table_schema.name}.${table_field.name} ${condition.type} @${table_field.name}1 AND @${table_field.name}2`
					params     [table_field.name + '1'] = condition.value[0]
					params     [table_field.name + '2'] = condition.value[1]
					param_types[table_field.name + '1'] = table_field_type
					param_types[table_field.name + '2'] = table_field_type
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
					}

					let i = 0
					const new_values = condition.value.map((value) => {
						i++
						const param_name = table_field.name + String(i)
						params     [param_name] = value
						param_types[param_name] = table_field_type
						return `@${param_name}`
					})
					sql_condition = `${table_schema.name}.${table_field.name} ${condition.type} (${new_values.join(',')})`
					break
				}

				// any field
				case 'IS NULL':
				case 'IS NOT NULL': {
					sql_condition = `${table_schema.name}.${table_field.name} ${condition.type}`
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

			sql_condition = `${table_field.name}=@${table_field.name}`
			params     [table_field.name] = condition
			param_types[table_field.name] = table_field_type
		}

		where_array.push(sql_condition)
	}

	return where_array
}

function add_all_params(table_schema, obj, params, param_types) {

	function validate_field_type(value, type) {

		if (is_int_type(type) || is_bigint_type(type)) { return typeof value === 'number'  }
		if (is_nvarchar_type(type))                    { return typeof value === 'string'  }
		if (is_bit_type(type))                         { return value === 0 || value === 1 }

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
		if (!validate_field_type(obj[field.name], field.type)) {
			throw {
				status: 400,
				message: `Wrong field type: ${field.name}`
			}
		}

		params     [field.name + DATA_POSTFIX] = obj[field.name] === undefined ? default_value : obj[field.name]
		param_types[field.name + DATA_POSTFIX] = field.type
	}

}

const DATA_POSTFIX = '_d'


module.exports.connect               = connect
module.exports.query                 = query
module.exports.stored_procedure      = stored_procedure
module.exports.schema                = schema

module.exports.is_nvarchar_type      = is_nvarchar_type
module.exports.is_number_type        = is_number_type
module.exports.is_bit_type           = is_bit_type
module.exports.is_int_type           = is_int_type
module.exports.is_nvarchar_type      = is_nvarchar_type
module.exports.is_bigint_type        = is_bigint_type

module.exports.get_table_schema      = get_table_schema
module.exports.get_field_names       = get_field_names
module.exports.filter_to_where_array = filter_to_where_array
module.exports.add_all_params        = add_all_params

module.exports.DATA_POSTFIX          = DATA_POSTFIX
