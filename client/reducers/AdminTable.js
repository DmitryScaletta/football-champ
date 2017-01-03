import { 
	ADMIN_FETCH_TABLE_REQUEST, 
	ADMIN_FETCH_TABLE_SUCCESS, 
	ADMIN_FETCH_TABLE_FAILURE,
	INVALIDATE_ADMIN_TABLE_DATA,
} from '../actions/AdminTable'
import initial_state from '../store/store'


export default function(state = initial_state.admin, action) {
	switch (action.type) {
		
		case ADMIN_FETCH_TABLE_REQUEST:
			return {
				...state,
				error: false,
				fetching: true,
				valid: false,
			}
		case ADMIN_FETCH_TABLE_SUCCESS:
			return {
				...state,
				data: action.data,
				fetching: false,
			}
		case ADMIN_FETCH_TABLE_FAILURE:
			return {
				...state,
				error: action.error,
				fetching: false,
			}

		case INVALIDATE_ADMIN_TABLE_DATA:
			return {
				...state,
				valid: false,
			}

		default:
			return state
	}
}