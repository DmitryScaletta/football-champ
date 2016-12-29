import axios from 'axios'

export const FETCH_MATCH_REQUEST = 'FETCH_MATCH_REQUEST'
export const FETCH_MATCH_SUCCESS = 'FETCH_MATCH_SUCCESS'
export const FETCH_MATCH_FAILURE = 'FETCH_MATCH_FAILURE'


export function fetch_match(match_id) {
	return (dispatch) => {
		dispatch({ type: FETCH_MATCH_REQUEST })

		axios.get(`/api/match/${match_id}`)
		.then(
			(result) => {
				dispatch({
					type: FETCH_MATCH_SUCCESS,
					data: result.data
				})
			},
			(error) => {
				dispatch({
					type: FETCH_MATCH_FAILURE,
					error: error.response.data
				})
			}
		)
	}
}

