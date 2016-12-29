import { 
	FETCH_CHAMPIONATS_REQUEST, 
	FETCH_CHAMPIONATS_SUCCESS, 
	FETCH_CHAMPIONATS_FAILURE,
} from '../actions/Championat'
import initial_state from '../store/store'


export default function(state = initial_state.championat, action) {
	switch (action.type) {
		
		case FETCH_CHAMPIONATS_REQUEST:
			return {
				...state,
				error: false,
				fetching: true
			}

		case FETCH_CHAMPIONATS_SUCCESS:
			return {
				...state,
				items: action.championats,
				fetching: false
			}

		case FETCH_CHAMPIONATS_FAILURE:
			return {
				...state,
				error: action.error,
				fetching: false
			}

		default:
			return state
	}
}