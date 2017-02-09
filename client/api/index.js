import axios from 'axios'

export function api_get_record(table_name, id) {
	return new Promise((resolve, reject) => {
		axios.get(`/api/${table_name}/${id}`)
		.then(
			(result) => resolve(result.data),
			(error)  => reject(error.response.data)
		)
	})
}

export function api_update_record(table_name, new_record) {
	return new Promise((resolve, reject) => {
		axios.put(`/api/${table_name}/${new_record.id}`, new_record)
		.then(
			(result) => resolve(result.data.affected),
			(error)  => reject(error.response.data)
		)
	})
}

export function api_create_record(table_name, new_record) {
	return new Promise((resolve, reject) => {
		axios.post(`/api/${table_name}`, new_record)
		.then(
			(result) => resolve(result.data.affected),
			(error)  => reject(error.response.data)
		)
	})
}

export function api_delete_record(table_name, id) {
	return new Promise((resolve, reject) => {
		axios.delete(`/api/${table_name}/${id}`)
		.then(
			(result) => resolve(result.data.affected),
			(error)  => reject(error.response.data)
		)
	})
}

export function api_table_search(table_name, request_data = undefined) {
	return new Promise((resolve, reject) => {
		axios.post(`/api/${table_name}/search`, request_data)
		.then(
			(result) => resolve(result.data),
			(error)  => reject(error.response.data)
		)
	})
}

export function api_league_table(season_id) {
	return new Promise((resolve, reject) => {
		axios.get(`/api/league_table/${season_id}`)
		.then(
			(result) => resolve(result.data),
			(error)  => reject(error.response.data)
		)
	})
}
