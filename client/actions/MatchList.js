import { api_table_search } from '../api'

export const FETCH_MATCHES_REQUEST = 'FETCH_MATCHES_REQUEST'
export const FETCH_MATCHES_SUCCESS = 'FETCH_MATCHES_SUCCESS'
export const FETCH_MATCHES_FAILURE = 'FETCH_MATCHES_FAILURE'


export function fetch_matches(limit = 20) {
	return (dispatch) => {
		dispatch({ type: FETCH_MATCHES_REQUEST })

		Promise.all([
			api_table_search('match', {
				filter: {
					is_over: 0
				},
				limit,
				order_by: 'match_date',
				order_type: 'ASC'
			}),
			api_table_search('match', {
				filter: {
					is_over: 1
				},
				limit,
				order_by: 'match_date',
				order_type: 'DESC'
			}),
		]).then((result) => dispatch({
			type: FETCH_MATCHES_SUCCESS,
			matches: {
				last_matches: result[0],
				next_matches: result[1],
			}
		})).catch((error) => dispatch({
			type:  FETCH_MATCHES_FAILURE,
			error: error,
		}))
	}
}