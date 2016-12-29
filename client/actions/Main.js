import axios from 'axios'

/*export const FETCH_CHAMPIONAT_COUNTRIES_REQUEST = 'FETCH_CHAMPIONAT_COUNTRIES_REQUEST'
export const FETCH_CHAMPIONAT_COUNTRIES_SUCCESS = 'FETCH_CHAMPIONAT_COUNTRIES_SUCCESS'
export const FETCH_CHAMPIONAT_COUNTRIES_FAILURE = 'FETCH_CHAMPIONAT_COUNTRIES_FAILURE'

export function fetchChampionatCountries() {
	return (dispatch) => {
		dispatch({ type: FETCH_CHAMPIONAT_COUNTRIES_REQUEST })

		axios.post('/api/season/search')
		.then((result) => {
			dispatch({
				type: FETCH_CHAMPIONAT_COUNTRIES_SUCCESS,
				items: result.data
			})
		}).catch((error) => {
			dispatch({
				type: FETCH_CHAMPIONAT_COUNTRIES_FAILURE,
				error: error.response.data
			})
		})
	}
}*/