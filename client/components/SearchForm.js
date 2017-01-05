import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'

class SearchForm extends Component {
	render() {
		const { handleSubmit } = this.props
		return (
			<form className="form-inline" onSubmit={handleSubmit}>
				<Field className="form-control" name="q" component="input" type="text" placeholder="Поиск" />
				{' '}
				<button className="btn btn-outline-success" type="submit">Найти</button>
			</form>
		)
	}
}

export default reduxForm({
	form: 'search'
})(SearchForm)