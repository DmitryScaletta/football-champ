const fs  = require('fs')

const SQL_FILENAME  = 'data.sqlite3.sql'
const JSON_FILENAME = 'data.json'

let data = JSON.parse(fs.readFileSync(JSON_FILENAME))


const db_schema = require('../server/db/schema.js')


let sql = 'USE [football-champ]\nGO\n\n'


db_schema.forEach((table) => {

	let table_sql = `IF EXISTS (SELECT * FROM sysobjects WHERE xtype=\'U\' AND name=\'${table.name}\')\n\tDROP TABLE ${table.name}\nCREATE TABLE ${table.name}\n(\n`

	let sql_fields = table.fields.map((field) => {
		let f = '\t' + field.name + ' ' + field.type
		if (field.primary) {
			return f += ' IDENTITY PRIMARY KEY'
		} else 
		if (field.required) {
			return f += ' NOT NULL'
		} else
		if (field.default != undefined) {
			return f += ` DEFAULT ${field.default}`
		} else {
			return f
		}
	})


	table_sql += `${sql_fields.join(',\n')}\n);\n`
	table_sql += `SET IDENTITY_INSERT ${table.name} ON\n`


	let insert = `INSERT INTO ${table.name} (${table.fields.map((field) => field.name).join(',')}) VALUES (`

	let inserts = ''
	data[table.alias].forEach((row) => {
		let i = 0
		let values = []
		Object.keys(row).forEach((key) => {
			if (i >= table.fields.length) return
			if (table.fields[i++].type.includes('VARCHAR')) {
				row[key] = '\'' + row[key].replace('\'', '\'\'') + '\''
			}
			if (row[key] === undefined || row[key] === null) row[key] = 'NULL'
			values.push(row[key])
		})
		inserts += insert + values.join(',') + ')\n'
	})

	table_sql += inserts

	table_sql += `SET IDENTITY_INSERT ${table.name} OFF\n\n`

	sql += table_sql
})

sql += 'GO'

fs.writeFileSync(SQL_FILENAME, '\uFEFF' + sql, 'utf8')

