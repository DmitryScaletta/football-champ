import { 
	FETCH_CHAMPIONAT_COUNTRIES_REQUEST,
	FETCH_CHAMPIONAT_COUNTRIES_SUCCESS,
	FETCH_CHAMPIONAT_COUNTRIES_FAILURE
} from '../actions/Main'

const initialState = {
	items: [],
	error: false,
	fetching: false
}

export default function(state = initialState, action) {
	switch (action.type) {

		case FETCH_CHAMPIONAT_COUNTRIES_REQUEST:
			return {
				...state,
				error: false,
				fetching: true
			}

		case FETCH_CHAMPIONAT_COUNTRIES_SUCCESS:
			return {
				...state,
				items: action.items,
				fetching: false
			}

		case FETCH_CHAMPIONAT_COUNTRIES_FAILURE:
			return {
				...state,
				error: action.error,
				fetching: false
			}

		default:
			return state
	}
}