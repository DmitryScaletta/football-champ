import { 
	FETCH_RECORD_REQUEST,
	FETCH_RECORD_SUCCESS,
	FETCH_RECORD_FAILURE,
	FETCH_RECORD_CHAMPIONAT_REQUEST,
	FETCH_RECORD_CHAMPIONAT_SUCCESS,
	FETCH_RECORD_CHAMPIONAT_FAILURE,
	FETCH_RECORD_SEASON_REQUEST,
	FETCH_RECORD_SEASON_SUCCESS,
	FETCH_RECORD_SEASON_FAILURE,
	FETCH_RECORD_FC_REQUEST,
	FETCH_RECORD_FC_SUCCESS,
	FETCH_RECORD_FC_FAILURE,
	FETCH_RECORD_PLAYER_REQUEST,
	FETCH_RECORD_PLAYER_SUCCESS,
	FETCH_RECORD_PLAYER_FAILURE,
	FETCH_RECORD_TRAINER_REQUEST,
	FETCH_RECORD_TRAINER_SUCCESS,
	FETCH_RECORD_TRAINER_FAILURE,
	FETCH_RECORD_COUNTRY_REQUEST,
	FETCH_RECORD_COUNTRY_SUCCESS,
	FETCH_RECORD_COUNTRY_FAILURE,
	FETCH_RECORD_CITY_REQUEST,
	FETCH_RECORD_CITY_SUCCESS,
	FETCH_RECORD_CITY_FAILURE,
	FETCH_RECORD_LINE_REQUEST,
	FETCH_RECORD_LINE_SUCCESS,
	FETCH_RECORD_LINE_FAILURE,
	FETCH_RECORD_MATCH_REQUEST,
	FETCH_RECORD_MATCH_SUCCESS,
	FETCH_RECORD_MATCH_FAILURE,
	UPDATE_RECORD_REQUEST,
	UPDATE_RECORD_SUCCESS,
	UPDATE_RECORD_FAILURE,
	CREATE_RECORD_REQUEST,
	CREATE_RECORD_SUCCESS,
	CREATE_RECORD_FAILURE,
	LOAD_FORM_DATA,
} from '../actions/AdminEdit'
import initial_state from '../store/store'


export default function(state = initial_state.admin_edit, action) {
	switch (action.type) {
		
		case FETCH_RECORD_CHAMPIONAT_REQUEST:
		case FETCH_RECORD_SEASON_REQUEST:
		case FETCH_RECORD_FC_REQUEST:
		case FETCH_RECORD_PLAYER_REQUEST:
		case FETCH_RECORD_TRAINER_REQUEST:
		case FETCH_RECORD_COUNTRY_REQUEST:
		case FETCH_RECORD_CITY_REQUEST:
		case FETCH_RECORD_LINE_REQUEST:
		case FETCH_RECORD_MATCH_REQUEST:
			return {
				...state,
				data: {},
				error: false,
				fetching: true,
				valid: false,
			}
		case FETCH_RECORD_CHAMPIONAT_FAILURE:
		case FETCH_RECORD_SEASON_FAILURE:
		case FETCH_RECORD_FC_FAILURE:
		case FETCH_RECORD_PLAYER_FAILURE:
		case FETCH_RECORD_TRAINER_FAILURE:
		case FETCH_RECORD_COUNTRY_FAILURE:
		case FETCH_RECORD_CITY_FAILURE:
		case FETCH_RECORD_LINE_FAILURE:
		case FETCH_RECORD_MATCH_FAILURE:
			return {
				...state,
				error: action.error,
				fetching: false,
			}

		case FETCH_RECORD_CHAMPIONAT_SUCCESS:
			return {
				...state,
				data:      action.data,
				countries: action.countries,
				fetching:  false,
				valid:     true,
			}
		case FETCH_RECORD_SEASON_SUCCESS:
			return {
				...state,
				data:        action.data,
				championats: action.championats,
				fetching:    false,
				valid:       true,
			}
		case FETCH_RECORD_FC_SUCCESS:
			return {
				...state,
				data:      action.data,
				countries: action.countries,
				cities:    action.cities,
				trainers:  action.trainers,
				fetching:  false,
				valid:     true,
			}
		case FETCH_RECORD_PLAYER_SUCCESS:
			return {
				...state,
				data:      action.data,
				fcs:       action.fcs,
				countries: action.countries,
				lines:     action.lines,
				fetching:  false,
				valid:     true,
			}
		case FETCH_RECORD_TRAINER_SUCCESS:
			return {
				...state,
				data:     action.data,
				fetching: false,
				valid:    true,
			}
		case FETCH_RECORD_COUNTRY_SUCCESS:
			return {
				...state,
				data:     action.data,
				fetching: false,
				valid:    true,
			}
		case FETCH_RECORD_CITY_SUCCESS:
			return {
				...state,
				data:     action.data,
				country:  action.country,
				fetching: false,
				valid:    true,
			}
		case FETCH_RECORD_LINE_SUCCESS:
			return {
				...state,
				data:     action.data,
				fetching: false,
				valid:    true,
			}
		case FETCH_RECORD_MATCH_SUCCESS:
			return {
				...state,
				data:     action.data,
				seasons:  action.seasons,
				fcs:      action.fcs,
				fetching: false,
				valid:    true,
			}


		case UPDATE_RECORD_REQUEST:
			return {
				...state,
				error: false,
				fetching: true,
			}
		case UPDATE_RECORD_SUCCESS:
			return {
				...state,
				affected: action.affected,
				fetching: false,
				valid: false,
			}
		case UPDATE_RECORD_FAILURE:
			return {
				...state,
				error: action.error,
				fetching: false,
			}

		case CREATE_RECORD_REQUEST:
			return {
				...state,
				error: false,
				fetching: true,
			}
		case CREATE_RECORD_SUCCESS:
			return {
				...state,
				affected: action.affected,
				fetching: false,
				valid: false,
			}
		case CREATE_RECORD_FAILURE:
			return {
				...state,
				error: action.error,
				fetching: false,
			}

		case LOAD_FORM_DATA:
			return {
				...state,
				data: action.data,
			}

		default:
			return state
	}
}