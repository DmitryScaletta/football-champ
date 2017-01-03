import axios from 'axios'

export const ADMIN_FETCH_TABLE_REQUEST   = 'ADMIN_FETCH_TABLE_REQUEST'
export const ADMIN_FETCH_TABLE_SUCCESS   = 'ADMIN_FETCH_TABLE_SUCCESS'
export const ADMIN_FETCH_TABLE_FAILURE   = 'ADMIN_FETCH_TABLE_FAILURE'

export const ADMIN_CHANGE_CURRENT_FC     = 'ADMIN_CHANGE_CURRENT_FC'

export const ADMIN_CLEAR_DATA            = 'ADMIN_CLEAR_DATA'


export function fetch_table(table, fc_id = 0) {
	return (dispatch) => {

		if ((table === 'players' || table === 'matches') && fc_id === 0) {
			dispatch({ 
				type: ADMIN_FETCH_TABLE_SUCCESS,
				data: [],
			})
			return
		}

		dispatch({ type: ADMIN_FETCH_TABLE_REQUEST })

		let api_table = ''
		switch (table) {
			case 'championats': { api_table = 'championat' } break
			case 'seasons':     { api_table = 'season'     } break
			case 'fcs':         { api_table = 'fc'         } break
			case 'trainers':    { api_table = 'trainer'    } break
			case 'countries':   { api_table = 'country'    } break
			case 'cities':      { api_table = 'city'       } break
			case 'lines':       { api_table = 'line'       } break
			case 'players':     { api_table = 'player'     } break
			case 'matches':     { api_table = 'match'      } break

			default: {
				dispatch({
					type: ADMIN_FETCH_TABLE_FAILURE,
					error: 'Wrong table name'
				})
				return
			}
		}

		let request_data = {}

		if (api_table === 'player') {
			request_data = {
				filter: {
					fc_id: Number(fc_id)
				}
			}
		} else
		if (api_table === 'match') {
			request_data = {
				filter_or: {
					home_fc_id: Number(fc_id),
					away_fc_id: Number(fc_id),
				},
				order_by: 'match_date',
				order_type: 'DESC'
			}
		}

		axios.post(`/api/${api_table}/search`, request_data)
		.then(
			(result) => dispatch({
				type: ADMIN_FETCH_TABLE_SUCCESS,
				data: result.data
			}),
			(error) => dispatch({
				type: ADMIN_FETCH_TABLE_FAILURE,
				error: error.response.data
			})
		)
	}
}

export function change_current_fc(fc_id) {
	return {
		type: ADMIN_CHANGE_CURRENT_FC,
		current_fc: fc_id,
	}
}

export function admin_clear_data() {
	return {
		type: ADMIN_CLEAR_DATA,
	}
}
