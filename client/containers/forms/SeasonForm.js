import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import MenuItem             from 'material-ui/MenuItem'
import RaisedButton         from 'material-ui/RaisedButton'
import { SelectField }      from 'redux-form-material-ui'


class SeasonForm extends Component {

	render() {
		const { required, handleSubmit, action_type, championats, on_cancel, submitting } = this.props

		const submit_title = (action_type === 'new') ? 'Добавить' : (action_type === 'edit') ? 'Сохранить' : 'Error'

		let years = []
		for (let i = 2000; i <= 2017; ++i) {
			years.push(<MenuItem key={i} value={i} primaryText={i} />)
		}

		return (
			<form onSubmit={handleSubmit}>
				<div>
					<Field
						name="championat_id"
						component={SelectField}
						hintText="Чемпионат"
						floatingLabelText="Чемпионат"
						validate={required}
						fullWidth={true}
					>
						{ championats.map((champ) => <MenuItem key={champ.id} value={champ.id} primaryText={champ.name} />) }
					</Field>
					<Field
						name="year_begin"
						component={SelectField}
						hintText="Начало"
						floatingLabelText="Начало"
						validate={required}
						fullWidth={true}
					>
						{ years }
					</Field>
					<Field
						name="year_end"
						component={SelectField}
						hintText="Конец"
						floatingLabelText="Конец"
						validate={required}
						fullWidth={true}
					>
						{ years }
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

SeasonForm.propTypes = {
	data:          React.PropTypes.object,
	championats:   React.PropTypes.array,
	action_type:   React.PropTypes.string,
	submitting:    React.PropTypes.bool,
	on_cancel:     React.PropTypes.func,
	required:      React.PropTypes.func,
	handleSubmit:  React.PropTypes.func,
	initialValues: React.PropTypes.object,
}

export default reduxForm({
	form: 'season'
})(SeasonForm)

