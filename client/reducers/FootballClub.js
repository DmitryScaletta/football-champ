import { 
	FETCH_FC_REQUEST, 
	FETCH_FC_SUCCESS, 
	FETCH_FC_FAILURE,
} from '../actions/FootballClub'
import initial_state from '../store/store'


export default function(state = initial_state.fc, action) {
	switch (action.type) {
		
		case FETCH_FC_REQUEST:
			return {
				...state,
				error: false,
				fetching: true,
			}

		case FETCH_FC_SUCCESS:
			return {
				...state,
				data: action.data,
				players: action.players || [],
				last_matches: action.last_matches || [],
				next_matches: action.next_matches || [],
				fetching: false,
			}

		case FETCH_FC_FAILURE:
			return {
				...state,
				error: action.error,
				fetching: false,
			}

		default:
			return state
	}
}