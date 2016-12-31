import axios from 'axios'

export const ADMIN_FETCH_TABLE_REQUEST = 'ADMIN_FETCH_TABLE_REQUEST'
export const ADMIN_FETCH_TABLE_SUCCESS = 'ADMIN_FETCH_TABLE_SUCCESS'
export const ADMIN_FETCH_TABLE_FAILURE = 'ADMIN_FETCH_TABLE_FAILURE'




export function fetch_table(table) {
	return (dispatch) => {
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
			
			case 'players':
			case 'matches': {
				dispatch({
					type: ADMIN_FETCH_TABLE_SUCCESS,
					data: []
				})
				return
			}

			default: {
				dispatch({
					type: ADMIN_FETCH_TABLE_FAILURE,
					error: 'Wrong table name'
				})
				return
			}
		}

		axios.post(`/api/${api_table}/search`)
		.then(
			(result) => {
				dispatch({
					type: ADMIN_FETCH_TABLE_SUCCESS,
					data: result.data
				})
			},
			(error) => {
				dispatch({
					type: ADMIN_FETCH_TABLE_FAILURE,
					error: error.response.data
				})
			}
		)
	}
}

