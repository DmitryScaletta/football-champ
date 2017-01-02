import axios from 'axios'

export const FETCH_RECORD_REQUEST = 'FETCH_RECORD_REQUEST'
export const FETCH_RECORD_SUCCESS = 'FETCH_RECORD_SUCCESS'
export const FETCH_RECORD_FAILURE = 'FETCH_RECORD_FAILURE'

export const UPDATE_RECORD_REQUEST = 'UPDATE_RECORD_REQUEST'
export const UPDATE_RECORD_SUCCESS = 'UPDATE_RECORD_SUCCESS'
export const UPDATE_RECORD_FAILURE = 'UPDATE_RECORD_FAILURE'

export const CREATE_RECORD_REQUEST = 'CREATE_RECORD_REQUEST'
export const CREATE_RECORD_SUCCESS = 'CREATE_RECORD_SUCCESS'
export const CREATE_RECORD_FAILURE = 'CREATE_RECORD_FAILURE'


function validate_table_name(table_name) {
	switch (table_name) {
		case 'championats': return 'championat'
		case 'seasons':     return 'season'
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
			(result) => {
				dispatch({
					type: FETCH_RECORD_SUCCESS,
					data: result.data,
				})
			},
			(error) => {
				dispatch({
					type: FETCH_RECORD_FAILURE,
					error: error.response.data,
				})
			}
		)
	}
}

export function update_record(table, id, new_record) {
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

		axios.put(`/api/${table_name}/${id}`, new_record)
		.then(
			(result) => {
				dispatch({
					type: UPDATE_RECORD_SUCCESS,
					affected: result.data.affected,
				})
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

export function create_record(table, new_record) {
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