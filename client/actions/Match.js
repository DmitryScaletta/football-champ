import { api_get_record } from '../api'

export const FETCH_MATCH_REQUEST = 'FETCH_MATCH_REQUEST'
export const FETCH_MATCH_SUCCESS = 'FETCH_MATCH_SUCCESS'
export const FETCH_MATCH_FAILURE = 'FETCH_MATCH_FAILURE'


export function fetch_match(match_id) {
	return (dispatch) => {
		dispatch({ type: FETCH_MATCH_REQUEST })

		api_get_record('match', match_id)
		.then(
			(result) => dispatch({
				type: FETCH_MATCH_SUCCESS,
				data: result,
			}),
			(error) => dispatch({
				type: FETCH_MATCH_FAILURE,
				error: error,
			})
		)
	}
}

