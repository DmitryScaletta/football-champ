import { 
	FETCH_PLAYERS_REQUEST, 
	FETCH_PLAYERS_SUCCESS, 
	FETCH_PLAYERS_FAILURE,
} from '../actions/PlayerList'
import initial_state from '../store/store'


export default function(state = initial_state.players, action) {
	switch (action.type) {
		
		case FETCH_PLAYERS_REQUEST:
			return {
				...state,
				error: false,
				fetching: true
			}

		case FETCH_PLAYERS_SUCCESS:
			return {
				...state,
				items: action.items,
				fetching: false
			}

		case FETCH_PLAYERS_FAILURE:
			return {
				...state,
				error: action.error,
				fetching: false
			}

		default:
			return state
	}
}