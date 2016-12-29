import { 
	FETCH_MATCH_REQUEST, 
	FETCH_MATCH_SUCCESS, 
	FETCH_MATCH_FAILURE,
} from '../actions/Match'
import initial_state from '../store/store'


export default function(state = initial_state.match, action) {
	switch (action.type) {
		
		case FETCH_MATCH_REQUEST:
			return {
				...state,
				error: false,
				fetching: true
			}

		case FETCH_MATCH_SUCCESS:
			return {
				...state,
				data: action.data,
				fetching: false
			}

		case FETCH_MATCH_FAILURE:
			return {
				...state,
				error: action.error,
				fetching: false
			}

		default:
			return state
	}
}