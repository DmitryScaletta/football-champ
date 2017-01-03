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

export const LOAD_FORM_DATA                  = 'LOAD_FORM_DATA'


export function load_form_data(data) {
	return {
		type: LOAD_FORM_DATA,
		data,
	}
}

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
			seasons: false,
			fcs: false,
			trainers: false,
			countries: false,
			cities: false,
			lines: false,
		}

		switch (table) {
			case 'championats':
				tables['countries']  = true
				break
			case 'seasons':
				tables['champonats'] = true
				break
			case 'fcs':
				tables['countries']  = true
				tables['cities']     = true
				tables['trainers']   = true
				break
			case 'trainers':
			case 'countries':
			case 'lines':
				break
			case 'cities':
				tables['countries']  = true
				break
			case 'players':
				tables['fcs']        = true
				tables['countries']  = true
				tables['trainers']   = true
				break
			case 'matches':
				tables['fcs']        = true
				tables['seasons']    = true
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



/*export const FETCH_RECORD_CHAMPIONAT_REQUEST = 'FETCH_RECORD_CHAMPIONAT_REQUEST'
export const FETCH_RECORD_CHAMPIONAT_SUCCESS = 'FETCH_RECORD_CHAMPIONAT_SUCCESS'
export const FETCH_RECORD_CHAMPIONAT_FAILURE = 'FETCH_RECORD_CHAMPIONAT_FAILURE'

export const FETCH_RECORD_SEASON_REQUEST     = 'FETCH_RECORD_SEASON_REQUEST'
export const FETCH_RECORD_SEASON_SUCCESS     = 'FETCH_RECORD_SEASON_SUCCESS'
export const FETCH_RECORD_SEASON_FAILURE     = 'FETCH_RECORD_SEASON_FAILURE'

export const FETCH_RECORD_FC_REQUEST         = 'FETCH_RECORD_FC_REQUEST'
export const FETCH_RECORD_FC_SUCCESS         = 'FETCH_RECORD_FC_SUCCESS'
export const FETCH_RECORD_FC_FAILURE         = 'FETCH_RECORD_FC_FAILURE'

export const FETCH_RECORD_PLAYER_REQUEST     = 'FETCH_RECORD_PLAYER_REQUEST'
export const FETCH_RECORD_PLAYER_SUCCESS     = 'FETCH_RECORD_PLAYER_SUCCESS'
export const FETCH_RECORD_PLAYER_FAILURE     = 'FETCH_RECORD_PLAYER_FAILURE'

export const FETCH_RECORD_TRAINER_REQUEST    = 'FETCH_RECORD_TRAINER_REQUEST'
export const FETCH_RECORD_TRAINER_SUCCESS    = 'FETCH_RECORD_TRAINER_SUCCESS'
export const FETCH_RECORD_TRAINER_FAILURE    = 'FETCH_RECORD_TRAINER_FAILURE'

export const FETCH_RECORD_COUNTRY_REQUEST    = 'FETCH_RECORD_COUNTRY_REQUEST'
export const FETCH_RECORD_COUNTRY_SUCCESS    = 'FETCH_RECORD_COUNTRY_SUCCESS'
export const FETCH_RECORD_COUNTRY_FAILURE    = 'FETCH_RECORD_COUNTRY_FAILURE'

export const FETCH_RECORD_CITY_REQUEST       = 'FETCH_RECORD_CITY_REQUEST'
export const FETCH_RECORD_CITY_SUCCESS       = 'FETCH_RECORD_CITY_SUCCESS'
export const FETCH_RECORD_CITY_FAILURE       = 'FETCH_RECORD_CITY_FAILURE'

export const FETCH_RECORD_LINE_REQUEST       = 'FETCH_RECORD_LINE_REQUEST'
export const FETCH_RECORD_LINE_SUCCESS       = 'FETCH_RECORD_LINE_SUCCESS'
export const FETCH_RECORD_LINE_FAILURE       = 'FETCH_RECORD_LINE_FAILURE'

export const FETCH_RECORD_MATCH_REQUEST      = 'FETCH_RECORD_MATCH_REQUEST'
export const FETCH_RECORD_MATCH_SUCCESS      = 'FETCH_RECORD_MATCH_SUCCESS'
export const FETCH_RECORD_MATCH_FAILURE      = 'FETCH_RECORD_MATCH_FAILURE'*/


/*export function fetch_record_season(id) {
	return (dispatch) => {
		dispatch({ type: FETCH_RECORD_SEASON_REQUEST })

		Promise.all([
			axios.get(`/api/season/${id}`),
			axios.post('/api/championat/search'),
		])
		.then(
			(result) => dispatch({
				type: FETCH_RECORD_SEASON_SUCCESS,
				data: result[0].data,
				championats: result[1].data,
			}),
			(error) => dispatch({
				type: FETCH_RECORD_SEASON_FAILURE,
				error: error.response.data,
			})
		)
	}
}

export function fetch_record_fc(id) {
	return (dispatch) => {
		dispatch({ type: FETCH_RECORD_FC_REQUEST })

		Promise.all([
			axios.get(`/api/fc/${id}`),
			axios.post('/api/country/search'),
			axios.post('/api/city/search'),
			axios.post('/api/trainer/search'),
		])
		.then(
			(result) => dispatch({
				type:      FETCH_RECORD_FC_SUCCESS,
				data:      result[0].data,
				countries: result[1].data,
				cities:    result[2].data,
				trainers:  result[3].data,
			}),
			(error) => dispatch({
				type: FETCH_RECORD_FC_FAILURE,
				error: error.response.data,
			})
		)
	}
}

export function fetch_record_player(id) {
	return (dispatch) => {
		dispatch({ type: FETCH_RECORD_PLAYER_REQUEST })

		Promise.all([
			axios.get(`/api/player/${id}`),
			axios.post('/api/fc/search'),
			axios.post('/api/country/search'),
			axios.post('/api/line/search'),
		])
		.then(
			(result) => dispatch({
				type:      FETCH_RECORD_PLAYER_SUCCESS,
				data:      result[0].data,
				fcs:       result[1].data,
				countries: result[2].data,
				lines:     result[3].data,
			}),
			(error) => dispatch({
				type: FETCH_RECORD_PLAYER_FAILURE,
				error: error.response.data,
			})
		)
	}
}

export function fetch_record_trainer(id) {
	return (dispatch) => {
		dispatch({ type: FETCH_RECORD_TRAINER_REQUEST })

		axios.get(`/api/trainer/${id}`)
		.then(
			(result) => dispatch({
				type: FETCH_RECORD_TRAINER_SUCCESS,
				data: result.data,
			}),
			(error) => dispatch({
				type: FETCH_RECORD_TRAINER_FAILURE,
				error: error.response.data,
			})
		)
	}
}

export function fetch_record_country(id) {
	return (dispatch) => {
		dispatch({ type: FETCH_RECORD_COUNTRY_REQUEST })

		axios.get(`/api/trainer/${id}`)
		.then(
			(result) => dispatch({
				type: FETCH_RECORD_COUNTRY_SUCCESS,
				data: result.data,
			}),
			(error) => dispatch({
				type: FETCH_RECORD_COUNTRY_FAILURE,
				error: error.response.data,
			})
		)
	}
}

export function fetch_record_city(id) {
	return (dispatch) => {
		dispatch({ type: FETCH_RECORD_CITY_REQUEST })

		Promise.all([
			axios.get(`/api/player/${id}`),
			axios.post('/api/country/search'),
		])
		.then(
			(result) => dispatch({
				type:      FETCH_RECORD_CITY_SUCCESS,
				data:      result[0].data,
				countries: result[1].data,
			}),
			(error) => dispatch({
				type: FETCH_RECORD_CITY_FAILURE,
				error: error.response.data,
			})
		)
	}
}

export function fetch_record_line(id) {
	return (dispatch) => {
		dispatch({ type: FETCH_RECORD_LINE_REQUEST })

		axios.get(`/api/line/${id}`)
		.then(
			(result) => dispatch({
				type: FETCH_RECORD_LINE_SUCCESS,
				data: result.data,
			}),
			(error) => dispatch({
				type: FETCH_RECORD_LINE_FAILURE,
				error: error.response.data,
			})
		)
	}
}

export function fetch_record_match(id) {
	return (dispatch) => {
		dispatch({ type: FETCH_RECORD_MATCH_REQUEST })

		Promise.all([
			axios.get(`/api/match/${id}`),
			axios.post('/api/season/search'),
			axios.post('/api/fc/search'),
		])
		.then(
			(result) => dispatch({
				type:    FETCH_RECORD_MATCH_SUCCESS,
				data:    result[0].data,
				seasons: result[1].data,
				fcs:     result[2].data,
			}),
			(error) => dispatch({
				type: FETCH_RECORD_MATCH_FAILURE,
				error: error.response.data,
			})
		)
	}
}
*/