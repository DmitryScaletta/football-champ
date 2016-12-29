import axios from 'axios'

export const FETCH_FC_LIST_REQUEST = 'FETCH_FC_LIST_REQUEST'
export const FETCH_FC_LIST_SUCCESS = 'FETCH_FC_LIST_SUCCESS'
export const FETCH_FC_LIST_FAILURE = 'FETCH_FC_LIST_FAILURE'


export function fetch_football_clubs() {
	return (dispatch) => {
		dispatch({ type: FETCH_FC_LIST_REQUEST })

		axios.post('/api/fc/search')
		.then(
			(result) => {
				dispatch({
					type: FETCH_FC_LIST_SUCCESS,
					items: result.data
				})
			},
			(error) => {
				dispatch({
					type: FETCH_FC_LIST_FAILURE,
					error: error.response.data
				})
			}
		)
	}
}

