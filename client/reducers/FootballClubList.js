import { 
	FETCH_FC_LIST_REQUEST, 
	FETCH_FC_LIST_SUCCESS, 
	FETCH_FC_LIST_FAILURE,
	FC_LIST_CHANGE_FILTER,
} from '../actions/FootballClubList'
import initial_state from '../store/store'


export default function(state = initial_state.fcs, action) {
	switch (action.type) {
		
		case FETCH_FC_LIST_REQUEST:
			return {
				...state,
				error: false,
				fetching: true,
			}
		case FETCH_FC_LIST_SUCCESS:
			return {
				...state,
				items: action.items,
				fetching: false,
			}
		case FETCH_FC_LIST_FAILURE:
			return {
				...state,
				error: action.error,
				fetching: false,
			}

		case FC_LIST_CHANGE_FILTER:
			return {
				...state,
				filter: action.filter,
			}

		default:
			return state
	}
}