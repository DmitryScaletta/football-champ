import { 
	FETCH_MATCHES_REQUEST,
	FETCH_MATCHES_SUCCESS,
	FETCH_MATCHES_FAILURE,
} from '../actions/MatchList'
import initial_state from '../store/store'

export default function(state = initial_state.matches, action) {
	switch (action.type) {
		case FETCH_MATCHES_REQUEST:
			return {
				...state,
				error: null,
				fetching: true,
			}
		case FETCH_MATCHES_SUCCESS:
			return {
				...state,
				last_matches: action.matches.last_matches,
				next_matches: action.matches.next_matches,
				fetching: false
			}
		case FETCH_MATCHES_FAILURE:
			return {
				...state,
				error: action.error,
				fetching: false,
			}

		default:
			return state
	}
}