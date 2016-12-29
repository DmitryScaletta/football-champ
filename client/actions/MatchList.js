import axios from 'axios'

export const FETCH_MATCHES_REQUEST = 'FETCH_MATCHES_REQUEST'
export const FETCH_MATCHES_SUCCESS = 'FETCH_MATCHES_SUCCESS'
export const FETCH_MATCHES_FAILURE = 'FETCH_MATCHES_FAILURE'


export function fetch_matches(limit = 20) {
	return (dispatch) => {
		dispatch({ type: FETCH_MATCHES_REQUEST })

		Promise.all([
			axios.post('/api/match/search', {
				filter: {
					is_over: 0
				},
				limit,
				order_by: 'match_date',
				order_type: 'ASC'
			}),
			axios.post('/api/match/search', {
				filter: {
					is_over: 1
				},
				limit,
				order_by: 'match_date',
				order_type: 'DESC'
			}),
		]).then((result) => {
			dispatch({
				type: FETCH_MATCHES_SUCCESS,
				matches: {
					last_matches: result[0].data,
					next_matches: result[1].data,
				}
			})
		}).catch((error) => {
			dispatch({
				type: FETCH_MATCHES_FAILURE,
				error: error.response.data
			})
		})
	}
}