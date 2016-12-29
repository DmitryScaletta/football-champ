import axios from 'axios'

export const FETCH_PLAYERS_REQUEST = 'FETCH_PLAYERS_REQUEST'
export const FETCH_PLAYERS_SUCCESS = 'FETCH_PLAYERS_SUCCESS'
export const FETCH_PLAYERS_FAILURE = 'FETCH_PLAYERS_FAILURE'


export function fetch_players(search_string) {
	return (dispatch) => {
		dispatch({ type: FETCH_PLAYERS_REQUEST })

		axios.post('/api/player/search', {
			filter_or: {
				name:    { type: 'LIKE', value: `%${search_string}%` },
				surname: { type: 'LIKE', value: `%${search_string}%` },
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

