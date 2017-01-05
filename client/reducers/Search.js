import { 
	FETCH_SEARCH_REQUEST, 
	FETCH_SEARCH_SUCCESS, 
	FETCH_SEARCH_FAILURE,
	SET_SEARCH_TEXT,
} from '../actions/Search'
import initial_state from '../store/store'


export default function(state = initial_state.search, action) {
	switch (action.type) {
		
		case FETCH_SEARCH_REQUEST:
			return {
				...state,
				error:    false,
				fetching: true
			}

		case FETCH_SEARCH_SUCCESS:
			return {
				...state,
				fcs:      action.fcs,
				players:  action.players,
				fetching: false
			}

		case FETCH_SEARCH_FAILURE:
			return {
				...state,
				error:    action.error,
				fetching: false
			}

		case SET_SEARCH_TEXT:
			return {
				...state,
				text: action.text,
			}

		default:
			return state
	}
}