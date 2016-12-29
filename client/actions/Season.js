import axios from 'axios'

export const FETCH_SEASON_MATCHES_REQUEST = 'FETCH_SEASON_MATCHES_REQUEST'
export const FETCH_SEASON_MATCHES_SUCCESS = 'FETCH_SEASON_MATCHES_SUCCESS'
export const FETCH_SEASON_MATCHES_FAILURE = 'FETCH_SEASON_MATCHES_FAILURE'


export function fetch_season_matches(champ_id, years, limit = 10) {
	return (dispatch) => {
		dispatch({ type: FETCH_SEASON_MATCHES_REQUEST })

		const year_begin = Number(years.split('-')[0])
		axios.post('/api/season/search', {
			filter: {
				championat_id: Number(champ_id),
				year_begin
			}
		}).then((result) => {
			const season_id = result.data[0].id
			Promise.all([
				axios.post('/api/match/search', {
					filter: {
						season_id: season_id,
						is_over: 0
					},
					limit,
					order_by: 'match_date',
					order_type: 'ASC'
				}),
				axios.post('/api/match/search', {
					filter: {
						season_id: season_id,
						is_over: 1
					},
					limit,
					order_by: 'match_date',
					order_type: 'DESC'
				}),
				axios.get(`/api/league_table/${season_id}`)
			]).then((result) => {
				dispatch({
					type: FETCH_SEASON_MATCHES_SUCCESS,
					matches: {
						last_matches: result[0].data,
						next_matches: result[1].data,
						league_table: result[2].data,
					}
				})
			}).catch((error) => {
				dispatch({
					type: FETCH_SEASON_MATCHES_FAILURE,
					error: error.response.data
				})
			})
		}).catch((error) => {
			dispatch({
				type: FETCH_SEASON_MATCHES_FAILURE,
				error: error.response.data
			})
		})
	}
}