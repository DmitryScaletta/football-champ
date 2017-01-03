import axios from 'axios'

export const FETCH_CHAMPIONATS_REQUEST = 'FETCH_CHAMPIONATS_REQUEST'
export const FETCH_CHAMPIONATS_SUCCESS = 'FETCH_CHAMPIONATS_SUCCESS'
export const FETCH_CHAMPIONATS_FAILURE = 'FETCH_CHAMPIONATS_FAILURE'



export function fetch_championats() {
	return (dispatch) => {
		dispatch({ type: FETCH_CHAMPIONATS_REQUEST })

		axios.post('/api/match/search')
		.then(
			(result) => dispatch({ type: FETCH_CHAMPIONATS_SUCCESS, matches: result.data }),
			(error)  => dispatch({ type: FETCH_CHAMPIONATS_FAILURE, error:   error.response.data })
		)
	}
}