import { 
	FETCH_RECORD_REQUEST,
	FETCH_RECORD_SUCCESS,
	FETCH_RECORD_FAILURE,
	UPDATE_RECORD_REQUEST,
	UPDATE_RECORD_SUCCESS,
	UPDATE_RECORD_FAILURE,
	CREATE_RECORD_REQUEST,
	CREATE_RECORD_SUCCESS,
	CREATE_RECORD_FAILURE,	
} from '../actions/AdminEdit'
import initial_state from '../store/store'


export default function(state = initial_state.admin_edit, action) {
	switch (action.type) {
		
		case FETCH_RECORD_REQUEST:
			return {
				...state,
				error: false,
				fetching: true
			}
		case FETCH_RECORD_SUCCESS:
			return {
				...state,
				data: action.data,
				fetching: false
			}
		case FETCH_RECORD_FAILURE:
			return {
				...state,
				error: action.error,
				fetching: false
			}

		case UPDATE_RECORD_REQUEST:
			return {
				...state,
				error: false,
				fetching: true
			}
		case UPDATE_RECORD_SUCCESS:
			return {
				...state,
				affected: action.affected,
				fetching: false
			}
		case UPDATE_RECORD_FAILURE:
			return {
				...state,
				error: action.error,
				fetching: false
			}

		case CREATE_RECORD_REQUEST:
			return {
				...state,
				error: false,
				fetching: true
			}
		case CREATE_RECORD_SUCCESS:
			return {
				...state,
				affected: action.affected,
				fetching: false
			}
		case CREATE_RECORD_FAILURE:
			return {
				...state,
				error: action.error,
				fetching: false
			}

		default:
			return state
	}
}