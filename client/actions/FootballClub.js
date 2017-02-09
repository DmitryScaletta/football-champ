import { 
	api_get_record,
	api_table_search,
} from '../api'

export const FETCH_FC_REQUEST = 'FETCH_FC_REQUEST'
export const FETCH_FC_SUCCESS = 'FETCH_FC_SUCCESS'
export const FETCH_FC_FAILURE = 'FETCH_FC_FAILURE'


export function fetch_football_club(fc_id) {
	return (dispatch) => {
		dispatch({ type: FETCH_FC_REQUEST })

		Promise.all([
			api_get_record('fc', fc_id),
			api_table_search('player', {
				filter: {
					fc_id: Number(fc_id)
				}
			}),
			api_table_search('match', {
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
			api_table_search('match', {
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
		]).then((results) => dispatch({
			type:         FETCH_FC_SUCCESS,
			data:         results[0],
			players:      results[1],
			next_matches: results[2],
			last_matches: results[3],
		})).catch((error) => dispatch({
			type:  FETCH_FC_FAILURE,
			error: error,
		}))
	}
}

