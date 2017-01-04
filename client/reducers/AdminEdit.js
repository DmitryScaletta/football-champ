import { 
	FETCH_RECORD_REQUEST,
	FETCH_RECORD_SUCCESS,
	FETCH_RECORD_FAILURE,
	FETCH_ADDITIONAL_TABLES_REQUEST,
	FETCH_ADDITIONAL_TABLES_SUCCESS,
	FETCH_ADDITIONAL_TABLES_FAILURE,
	UPDATE_RECORD_REQUEST,
	UPDATE_RECORD_SUCCESS,
	UPDATE_RECORD_FAILURE,
	CREATE_RECORD_REQUEST,
	CREATE_RECORD_SUCCESS,
	CREATE_RECORD_FAILURE,
	DELETE_RECORD_REQUEST,
	DELETE_RECORD_SUCCESS,
	DELETE_RECORD_FAILURE,
	CLEAR_AFFECTED_DATA,
} from '../actions/AdminEdit'
import initial_state from '../store/store'


export default function(state = initial_state.admin_edit, action) {
	switch (action.type) {
		
		case FETCH_RECORD_REQUEST:
			return {
				...state,
				data:     {},
				error:    false,
				fetching: true,
			}
		case FETCH_RECORD_SUCCESS:
			return {
				...state,
				data:      action.data,
				fetching:  false,
			}
		case FETCH_RECORD_FAILURE:
			return {
				...state,
				error:    action.error,
				fetching: false,
			}

		case FETCH_ADDITIONAL_TABLES_REQUEST:
			return {
				...state,
				error2:    false,
				fetching2: true,
			}
		case FETCH_ADDITIONAL_TABLES_SUCCESS:
			return {
				...state,
				championats: action.championats,
				seasons:     action.seasons,
				fcs:         action.fcs,
				trainers:    action.trainers,
				countries:   action.countries,
				cities:      action.cities,
				lines:       action.lines,
				fetching2:   false,
			}
		case FETCH_ADDITIONAL_TABLES_FAILURE:
			return {
				...state,
				error2:    action.error,
				fetching2: false,
			}


		case UPDATE_RECORD_REQUEST:
			return {
				...state,
				affected:    0,
				last_action: '',
				error:       false,
				fetching:    true,
			}
		case UPDATE_RECORD_SUCCESS:
			return {
				...state,
				last_action: 'update',
				affected:    action.affected,
				fetching:    false,
			}
		case UPDATE_RECORD_FAILURE:
			return {
				...state,
				last_action: 'update',
				error:       action.error,
				fetching:    false,
			}

		case CREATE_RECORD_REQUEST:
			return {
				...state,
				affected:    0,
				last_action: '',
				error:       false,
				fetching:    true,
			}
		case CREATE_RECORD_SUCCESS:
			return {
				...state,
				last_action: 'create',
				affected:    action.affected,
				fetching:    false,
			}
		case CREATE_RECORD_FAILURE:
			return {
				...state,
				last_action: 'create',
				error:       action.error,
				fetching:    false,
			}

		case DELETE_RECORD_REQUEST:
			return {
				...state,
				affected:    0,
				last_action: 'delete',
				error:       false,
				fetching:    true,
			}
		case DELETE_RECORD_SUCCESS:
			return {
				...state,
				last_action: 'delete',
				affected:    action.affected,
				fetching:    false,
			}
		case DELETE_RECORD_FAILURE:
			return {
				...state,
				last_action: 'create',
				error:       action.error,
				fetching:    false,
			}

		case CLEAR_AFFECTED_DATA:
			return {
				...state,
				last_action: '',
				affected:    0,
			}

		default:
			return state
	}
}