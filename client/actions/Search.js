import { api_table_search } from '../api'

export const FETCH_SEARCH_REQUEST = 'FETCH_SEARCH_REQUEST'
export const FETCH_SEARCH_SUCCESS = 'FETCH_SEARCH_SUCCESS'
export const FETCH_SEARCH_FAILURE = 'FETCH_SEARCH_FAILURE'

export const SET_SEARCH_TEXT      = 'SET_SEARCH_TEXT'


export function fetch_search(text) {
	return (dispatch) => {
		dispatch({ type: FETCH_SEARCH_REQUEST })

		Promise.all([
			api_table_search('fc', {
				filter: {
					name: { type: 'LIKE', value: `%${text}%` }
				},
				limit: 20
			}),
			api_table_search('player', {
				filter_or: {
					name:    { type: 'LIKE', value: `%${text}%` },
					surname: { type: 'LIKE', value: `%${text}%` },
				},
				limit: 50
			})
		])
		.then(
			(result) => dispatch({
				type:    FETCH_SEARCH_SUCCESS,
				fcs:     result[0],
				players: result[1],
			}),
			(error) => dispatch({
				type:  FETCH_SEARCH_FAILURE,
				error: error,
			})
		)
	}
}

export function set_search_text(text) {
	return {
		type: SET_SEARCH_TEXT, 
		text,
	}
}