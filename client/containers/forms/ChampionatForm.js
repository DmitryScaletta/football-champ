import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import MenuItem             from 'material-ui/MenuItem'
import RaisedButton         from 'material-ui/RaisedButton'
import {
	// Checkbox,
	// DatePicker,
	SelectField,
	TextField,
} from 'redux-form-material-ui'


class ChampionatForm extends Component {

	componentDidMount() {
		this.refs.name              // the Field
			.getRenderedComponent() // on Field, returns ReduxFormMaterialUITextField
			.getRenderedComponent() // on ReduxFormMaterialUITextField, returns TextField
			.focus()                // on TextField
	}

	render() {
		const { required, handleSubmit, action_type, countries, on_cancel, submitting } = this.props

		const submit_title = (action_type === 'new') ? 'Добавить' : (action_type === 'edit') ? 'Сохранить' : 'Error'

		return (
			<form onSubmit={handleSubmit}>
				<div>
					<Field 
						name="name"
						component={TextField}
						hintText="Название чемпионата"
						floatingLabelText="Название"
						validate={required}
						fullWidth={true}
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
						validate={required}
						fullWidth={true}
					>
						{ countries.map((country) => <MenuItem key={country.id} value={country.id} primaryText={country.name} />) }
					</Field>
				</div>
				<div style={{ paddingTop: '20px' }}>
					<RaisedButton label={submit_title} type="submit" disabled={submitting} primary={true} />
					{' '}
					<RaisedButton label="Отмена" type="button" disabled={submitting} onClick={on_cancel} />
				</div>
			</form>
		)
	}
}

ChampionatForm.propTypes = {
	data:          React.PropTypes.object,
	countries:     React.PropTypes.array,
	action_type:   React.PropTypes.string,
	submitting:    React.PropTypes.bool,
	on_cancel:     React.PropTypes.func,
	required:      React.PropTypes.func,
	handleSubmit:  React.PropTypes.func,
	initialValues: React.PropTypes.object,
}

export default reduxForm({
	form: 'championat'
})(ChampionatForm)

