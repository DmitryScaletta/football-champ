import axios from 'axios'

export const FETCH_PLAYER_REQUEST = 'FETCH_PLAYER_REQUEST'
export const FETCH_PLAYER_SUCCESS = 'FETCH_PLAYER_SUCCESS'
export const FETCH_PLAYER_FAILURE = 'FETCH_PLAYER_FAILURE'


export function fetch_player(player_id) {
	return (dispatch) => {
		dispatch({ type: FETCH_PLAYER_REQUEST })

		axios.get(`/api/player/${player_id}`)
		.then(
			(result) => {
				dispatch({
					type: FETCH_PLAYER_SUCCESS,
					data: result.data
				})
			},
			(error) => {
				dispatch({
					type: FETCH_PLAYER_FAILURE,
					error: error.response.data
				})
			}
		)
	}
}

