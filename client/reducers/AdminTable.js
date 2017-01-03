import { 
	ADMIN_FETCH_TABLE_REQUEST, 
	ADMIN_FETCH_TABLE_SUCCESS, 
	ADMIN_FETCH_TABLE_FAILURE,
	ADMIN_CHANGE_CURRENT_FC,
	ADMIN_CLEAR_DATA,
} from '../actions/AdminTable'
import initial_state from '../store/store'


export default function(state = initial_state.admin, action) {
	switch (action.type) {
		
		case ADMIN_FETCH_TABLE_REQUEST:
			return {
				...state,
				data:     [],
				error:    false,
				fetching: true,
			}
		case ADMIN_FETCH_TABLE_SUCCESS:
			return {
				...state,
				data:     action.data,
				fetching: false,
			}
		case ADMIN_FETCH_TABLE_FAILURE:
			return {
				...state,
				error:    action.error,
				fetching: false,
			}

		case ADMIN_CHANGE_CURRENT_FC:
			return {
				...state,
				current_fc: action.current_fc,
			}

		case ADMIN_CLEAR_DATA:
			return {
				...state,
				data:       [],
				current_fc: 0,
			}

		default:
			return state
	}
}