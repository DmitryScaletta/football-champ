import React, { Component } from 'react'
import { connect }          from 'react-redux'
import { Field, reduxForm } from 'redux-form'
// import { RadioButton } from 'material-ui/RadioButton'
import MenuItem from 'material-ui/MenuItem'
// import { AutoComplete as MUIAutoComplete } from 'material-ui'
import RaisedButton from 'material-ui/RaisedButton'
import {
	// Checkbox,
	// DatePicker,
	SelectField,
	TextField,
} from 'redux-form-material-ui'
import { load_form_data } from '../../actions/AdminEdit'


// validation functions
const required = value => value == null ? 'Required' : undefined

class ChampionatForm extends Component {

	componentDidMount() {
		this.refs.name              // the Field
			.getRenderedComponent() // on Field, returns ReduxFormMaterialUITextField
			.getRenderedComponent() // on ReduxFormMaterialUITextField, returns TextField
			.focus()                // on TextField

		const { action_type, load_form_data, data } = this.props

		// if (action_type === 'edit') {
			// load_form_data(data)
		// }
	}

	// componentDidUpdate() {}

	render() {
		const { action_type, countries, onCancel, handleSubmit, pristine, reset, submitting } = this.props

		function get_country_id_by_name(country_name) {
			for (const country of countries) {
				if (country.name === country_name) return country.id
			}
			return false
		}

		const submit_title = (action_type === 'new') ? 'Добавить' : (action_type === 'edit') ? 'Сохранить' : 'Error'

		// console.log(action_type)

		return (
			<form onSubmit={handleSubmit}>
				<div>
					<Field 
						name="name"
						component={TextField}
						hintText="Название чемпионата"
						floatingLabelText="Название"
						ref="name" 
						withRef
					/>
				</div>
				<div>
					<Field
						name="country_id"
						component={SelectField}
						hintText="Страна"
						floatingLabelText="Страна"
					>
						{ countries.map((country) => <MenuItem key={country.id} value={country.id} primaryText={country.name} />) }
					</Field>
				</div>
				<div>
					<RaisedButton label={submit_title} type="submit" disabled={submitting} primary={true} />
					{' '}
					<RaisedButton label="Отмена" type="button" disabled={submitting} onClick={onCancel} />
				</div>
			</form>
		)
	}
}

ChampionatForm.propTypes = {
	data:           React.PropTypes.object,
	countries:      React.PropTypes.array,
	initialValues:  React.PropTypes.object,
	load_form_data: React.PropTypes.func,
}

/*function mapStateToProps(state) {
	return {
		initialValues: state.admin_edit.data,
	}
}*/

// export default connect(mapStateToProps, { load_form_data })(reduxForm({
// 	form: 'championat'
// })(ChampionatForm))

export default reduxForm({
	form: 'championat'
})(ChampionatForm)

