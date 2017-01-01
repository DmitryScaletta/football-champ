import { 
	ADMIN_FETCH_TABLE_REQUEST, 
	ADMIN_FETCH_TABLE_SUCCESS, 
	ADMIN_FETCH_TABLE_FAILURE,
	ADMIN_CHANGE_CURRENT_ROW,
} from '../actions/AdminEdit'
import initial_state from '../store/store'


export default function(state = initial_state.admin_edit, action) {
	switch (action.type) {
		
		case ADMIN_FETCH_TABLE_REQUEST:
			return {
				...state,
				error: false,
				fetching: true
			}
		case ADMIN_FETCH_TABLE_SUCCESS:
			return {
				...state,
				data: action.data,
				fetching: false
			}
		case ADMIN_FETCH_TABLE_FAILURE:
			return {
				...state,
				error: action.error,
				fetching: false
			}

		default:
			return state
	}
}