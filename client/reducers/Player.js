import { 
	FETCH_PLAYER_REQUEST, 
	FETCH_PLAYER_SUCCESS, 
	FETCH_PLAYER_FAILURE,
} from '../actions/Player'
import initial_state from '../store/store'


export default function(state = initial_state.player, action) {
	switch (action.type) {
		
		case FETCH_PLAYER_REQUEST:
			return {
				...state,
				error: false,
				fetching: true
			}

		case FETCH_PLAYER_SUCCESS:
			return {
				...state,
				data: action.data,
				fetching: false
			}

		case FETCH_PLAYER_FAILURE:
			return {
				...state,
				error: action.error,
				fetching: false
			}

		default:
			return state
	}
}