import axios from 'axios'

export const FETCH_FC_REQUEST = 'FETCH_FC_REQUEST'
export const FETCH_FC_SUCCESS = 'FETCH_FC_SUCCESS'
export const FETCH_FC_FAILURE = 'FETCH_FC_FAILURE'


export function fetch_football_club(fc_id) {
	return (dispatch) => {
		dispatch({ type: FETCH_FC_REQUEST })

		Promise.all([
			axios.get(`/api/fc/${fc_id}`),
			axios.post('/api/player/search', {
				filter: {
					fc_id: Number(fc_id)
				}
			}),
			axios.post('/api/match/search', {
				filter: {
					is_over: 0
				},
				filter_or: {
					home_fc_id: Number(fc_id),
					away_fc_id: Number(fc_id)
				},
				limit: 5,
				order_by: 'match_date',
				order_type: 'ASC'
			}),
			axios.post('/api/match/search', {
				filter: {
					is_over: 1
				},
				filter_or: {
					home_fc_id: Number(fc_id),
					away_fc_id: Number(fc_id)
				},
				limit: 5,
				order_by: 'match_date',
				order_type: 'DESC'
			})
		]).then((results) => {
			dispatch({
				type:         FETCH_FC_SUCCESS,
				data:         results[0].data,
				players:      results[1].data,
				next_matches: results[2].data,
				last_matches: results[3].data,
			})
		}).catch((error) => {
			dispatch({
				type: FETCH_FC_FAILURE,
				error: error.response.data
			})
		})
	}
}

