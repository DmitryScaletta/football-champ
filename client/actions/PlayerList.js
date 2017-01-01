import axios from 'axios'

export const FETCH_PLAYERS_REQUEST = 'FETCH_PLAYERS_REQUEST'
export const FETCH_PLAYERS_SUCCESS = 'FETCH_PLAYERS_SUCCESS'
export const FETCH_PLAYERS_FAILURE = 'FETCH_PLAYERS_FAILURE'


export function fetch_players(fc_id) {
	return (dispatch) => {
		dispatch({ type: FETCH_PLAYERS_REQUEST })

		axios.post('/api/player/search', {
			filter: {
				fc_id: Number(fc_id)
			}
		})
		.then(
			(result) => {
				dispatch({
					type: FETCH_PLAYERS_SUCCESS,
					items: result.data
				})
			},
			(error) => {
				dispatch({
					type: FETCH_PLAYERS_FAILURE,
					error: error.response.data
				})
			}
		)
	}
}

