import { api_table_search } from '../api'

export const FETCH_CHAMPIONATS_REQUEST = 'FETCH_CHAMPIONATS_REQUEST'
export const FETCH_CHAMPIONATS_SUCCESS = 'FETCH_CHAMPIONATS_SUCCESS'
export const FETCH_CHAMPIONATS_FAILURE = 'FETCH_CHAMPIONATS_FAILURE'


export function fetch_championats() {
	return (dispatch) => {
		dispatch({ type: FETCH_CHAMPIONATS_REQUEST })

		api_table_search('championat')
		.then(
			(result) => dispatch({
				type: FETCH_CHAMPIONATS_SUCCESS,
				championats: result,
			}),
			(error) => dispatch({
				type: FETCH_CHAMPIONATS_FAILURE,
				error: error,
			})
		)
	}
}

