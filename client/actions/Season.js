import {
	api_table_search,
	api_league_table,
} from '../api'

export const FETCH_SEASON_MATCHES_REQUEST = 'FETCH_SEASON_MATCHES_REQUEST'
export const FETCH_SEASON_MATCHES_SUCCESS = 'FETCH_SEASON_MATCHES_SUCCESS'
export const FETCH_SEASON_MATCHES_FAILURE = 'FETCH_SEASON_MATCHES_FAILURE'


export function fetch_season_matches(champ_id, years, limit = 10) {
	return (dispatch) => {
		dispatch({ type: FETCH_SEASON_MATCHES_REQUEST })

		const year_begin = Number(years.split('-')[0])
		api_table_search('season', {
			filter: {
				championat_id: Number(champ_id),
				year_begin
			}
		})
		.then((result) => {
			const season_id = result[0].id
			Promise.all([
				api_table_search('match', {
					filter: {
						season_id: season_id,
						is_over: 0
					},
					limit,
					order_by: 'match_date',
					order_type: 'ASC'
				}),
				api_table_search('match', {
					filter: {
						season_id: season_id,
						is_over: 1
					},
					limit,
					order_by: 'match_date',
					order_type: 'DESC'
				}),
				api_league_table(season_id)
			]).then((result) => {
				dispatch({
					type: FETCH_SEASON_MATCHES_SUCCESS,
					matches: {
						last_matches: result[0],
						next_matches: result[1],
						league_table: result[2],
					}
				})
			}).catch((error) => {
				dispatch({
					type: FETCH_SEASON_MATCHES_FAILURE,
					error: error
				})
			})
		}).catch((error) => {
			dispatch({
				type: FETCH_SEASON_MATCHES_FAILURE,
				error: error
			})
		})
	}
}