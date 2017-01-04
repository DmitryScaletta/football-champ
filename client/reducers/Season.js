import { 
	FETCH_SEASON_MATCHES_REQUEST,
	FETCH_SEASON_MATCHES_SUCCESS,
	FETCH_SEASON_MATCHES_FAILURE,
} from '../actions/Season'
import initial_state from '../store/store'


export default function(state = initial_state.season, action) {
	switch (action.type) {
		
		case FETCH_SEASON_MATCHES_REQUEST:
			return {
				...state,
				error: null,
				fetching: true,
			}
		case FETCH_SEASON_MATCHES_SUCCESS:
			return {
				...state,
				last_matches: action.matches.last_matches,
				next_matches: action.matches.next_matches,
				league_table: action.matches.league_table,
				fetching: false
			}
		case FETCH_SEASON_MATCHES_FAILURE:
			return {
				...state,
				error: action.error,
				fetching: false,
			}

		default:
			return state
	}
}