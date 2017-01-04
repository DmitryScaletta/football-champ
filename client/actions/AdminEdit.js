import axios from 'axios'

export const FETCH_RECORD_REQUEST            = 'FETCH_RECORD_REQUEST'
export const FETCH_RECORD_SUCCESS            = 'FETCH_RECORD_SUCCESS'
export const FETCH_RECORD_FAILURE            = 'FETCH_RECORD_FAILURE'

export const FETCH_ADDITIONAL_TABLES_REQUEST = 'FETCH_ADDITIONAL_TABLES_REQUEST'
export const FETCH_ADDITIONAL_TABLES_SUCCESS = 'FETCH_ADDITIONAL_TABLES_SUCCESS'
export const FETCH_ADDITIONAL_TABLES_FAILURE = 'FETCH_ADDITIONAL_TABLES_FAILURE'

export const UPDATE_RECORD_REQUEST           = 'UPDATE_RECORD_REQUEST'
export const UPDATE_RECORD_SUCCESS           = 'UPDATE_RECORD_SUCCESS'
export const UPDATE_RECORD_FAILURE           = 'UPDATE_RECORD_FAILURE'

export const CREATE_RECORD_REQUEST           = 'CREATE_RECORD_REQUEST'
export const CREATE_RECORD_SUCCESS           = 'CREATE_RECORD_SUCCESS'
export const CREATE_RECORD_FAILURE           = 'CREATE_RECORD_FAILURE'

export const DELETE_RECORD_REQUEST           = 'DELETE_RECORD_REQUEST'
export const DELETE_RECORD_SUCCESS           = 'DELETE_RECORD_SUCCESS'
export const DELETE_RECORD_FAILURE           = 'DELETE_RECORD_FAILURE'

export const CLEAR_AFFECTED_DATA             = 'CLEAR_AFFECTED_DATA'


export function clear_affected_data() {
	return { type: CLEAR_AFFECTED_DATA, }
}

function validate_table_name(table_name) {
	switch (table_name) {
		case 'championats': return 'championat'
		case 'seasons':     return 'season'
		case 'season-fcs':  return 'season-fc'
		case 'fcs':         return 'fc'
		case 'trainers':    return 'trainer'
		case 'countries':   return 'country'
		case 'cities':      return 'city'
		case 'lines':       return 'line'
		case 'players':     return 'player'
		case 'matches':     return 'match'

		default:            return false
	}
}

export function fetch_record(table, id) {
	return (dispatch) => {
		dispatch({ type: FETCH_RECORD_REQUEST })

		const table_name = validate_table_name(table)

		if (!table_name) {
			dispatch({
				type: FETCH_RECORD_FAILURE,
				error: 'Wrong table name',
			})
			return
		}

		axios.get(`/api/${table_name}/${id}`)
		.then(
			(result) => dispatch({
				type: FETCH_RECORD_SUCCESS,
				data: result.data,
			}),
			(error) => dispatch({
				type: FETCH_RECORD_FAILURE,
				error: error.response.data,
			})
		)
	}
}

export function update_record(table, new_record, callback) {
	return (dispatch) => {
		dispatch({ type: UPDATE_RECORD_REQUEST })

		const table_name = validate_table_name(table)

		if (!table_name) {
			dispatch({
				type: UPDATE_RECORD_FAILURE,
				error: 'Wrong table name',
			})
			return
		}

		axios.put(`/api/${table_name}/${new_record.id}`, new_record)
		.then(
			(result) => {
				dispatch({
					type: UPDATE_RECORD_SUCCESS,
					affected: result.data.affected,
				})
				callback()
			},
			(error) => {
				dispatch({
					type: UPDATE_RECORD_FAILURE,
					error: error.response.data,
				})
			}
		)
	}
}

export function create_record(table, new_record, callback) {
	return (dispatch) => {
		dispatch({ type: CREATE_RECORD_REQUEST })

		const table_name = validate_table_name(table)

		if (!table_name) {
			dispatch({
				type: CREATE_RECORD_FAILURE,
				error: 'Wrong table name',
			})
			return
		}

		axios.post(`/api/${table_name}`, new_record)
		.then(
			(result) => {
				dispatch({
					type: CREATE_RECORD_SUCCESS,
					affected: result.data.affected,
				})
				callback()
			},
			(error) => {
				dispatch({
					type: CREATE_RECORD_FAILURE,
					error: error.response.data,
				})
			}
		)
	}
}

export function delete_record(table, id, callback) {
	return (dispatch) => {
		dispatch({ type: DELETE_RECORD_REQUEST })

		const table_name = validate_table_name(table)

		if (!table_name) {
			dispatch({
				type: DELETE_RECORD_FAILURE,
				error: 'Wrong table name',
			})
			return
		}

		axios.delete(`/api/${table_name}/${id}`)
		.then(
			(result) => {
				dispatch({
					type: DELETE_RECORD_SUCCESS,
					affected: result.data.affected,
				})
				callback()
			},
			(error) => {
				dispatch({
					type: DELETE_RECORD_FAILURE,
					error: error.response.data,
				})
			}
		)
	}
}

export function fetch_additional_tables(table) {
	return (dispatch) => {
		dispatch({ type: FETCH_ADDITIONAL_TABLES_REQUEST })

		let tables = {
			championats: false,
			seasons:     false,
			fcs:         false,
			trainers:    false,
			countries:   false,
			cities:      false,
			lines:       false,
		}

		switch (table) {
			case 'championats':
				tables['countries']   = true
				break
			case 'season-fcs':
				tables['seasons']     = true
				tables['fcs']         = true
				break
			case 'seasons':
				tables['championats'] = true
				break
			case 'fcs':
				tables['countries']   = true
				tables['cities']      = true
				tables['trainers']    = true
				break
			case 'trainers':
			case 'countries':
			case 'lines':
				break
			case 'cities':
				tables['countries']   = true
				break
			case 'players':
				tables['fcs']         = true
				tables['countries']   = true
				tables['lines']       = true
				break
			case 'matches':
				tables['fcs']         = true
				tables['seasons']     = true
				break
		}

		let promises = []

		promises.push(tables['championats'] ? axios.post('/api/championat/search') : Promise.resolve({ data: [] }))
		promises.push(tables['seasons']     ? axios.post('/api/season/search')     : Promise.resolve({ data: [] }))
		promises.push(tables['fcs']         ? axios.post('/api/fc/search')         : Promise.resolve({ data: [] }))
		promises.push(tables['trainers']    ? axios.post('/api/trainer/search')    : Promise.resolve({ data: [] }))
		promises.push(tables['countries']   ? axios.post('/api/country/search')    : Promise.resolve({ data: [] }))
		promises.push(tables['cities']      ? axios.post('/api/city/search')       : Promise.resolve({ data: [] }))
		promises.push(tables['lines']       ? axios.post('/api/line/search')       : Promise.resolve({ data: [] }))

		Promise.all(promises)
		.then(
			(result) => dispatch({
				type:        FETCH_ADDITIONAL_TABLES_SUCCESS,
				championats: result[0].data,
				seasons:     result[1].data,
				fcs:         result[2].data,
				trainers:    result[3].data,
				countries:   result[4].data,
				cities:      result[5].data,
				lines:       result[6].data,
			}),
			(error) => dispatch({
				type:  FETCH_ADDITIONAL_TABLES_FAILURE,
				error: error.response.data,
			})
		)
	}
}
