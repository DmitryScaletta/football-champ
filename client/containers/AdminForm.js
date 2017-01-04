import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import MenuItem             from 'material-ui/MenuItem'
import RaisedButton         from 'material-ui/RaisedButton'
import {
	Checkbox,
	DatePicker,
	TimePicker,
	SelectField,
	TextField,
} from 'redux-form-material-ui'


class ChampionatForm extends Component {

	/*componentDidMount() {
		this.refs.name              // the Field
			.getRenderedComponent() // on Field, returns ReduxFormMaterialUITextField
			.getRenderedComponent() // on ReduxFormMaterialUITextField, returns TextField
			.focus()                // on TextField
	}*/

	render_fields() {
		const { table_name, required } = this.props

		let fields = []

		switch (table_name) {
			case 'championats': {
				const { countries } = this.props
				fields = [
					{	type:       'TextField',
						name:       'name',
						label:      'Название',
						hint:       'Название чемпионата',
						required:   true,
					}, 
					{	type:       'SelectField',
						name:       'country_id',
						label:      'Страна',
						hint:       'Страна',
						required:   true,
						items:      countries.map((country) => ({ value: country.id, text: country.name }))
					},
				]
				break
			}
			case 'seasons': {
				const { championats } = this.props
				let years = []
				for (let i = 2000; i <= 2017; ++i) {
					years.push({ value: i, text: i })
				}
				fields = [
					{	type:       'SelectField',
						name:       'championat_id',
						label:      'Чемпионат',
						hint:       'Чемпионат',
						required:   true,
						items:      championats.map((champ) => ({ value: champ.id, text: champ.name }))
					},
					{	type:       'SelectField',
						name:       'year_begin',
						label:      'Начало',
						hint:       'Начало',
						required:   true,
						items:      years,
					},
					{	type:       'SelectField',
						name:       'year_end',
						label:      'Конец',
						hint:       'Конец',
						required:   true,
						items:      years,
					},
				]
				break
			}
			case 'fcs': {
				const { countries, cities, trainers } = this.props
				fields = [
					{	type:       'TextField',
						name:       'name',
						label:      'Название',
						hint:       'Название',
						required:   true,
					},
					{	type:       'TextField',
						name:       'name_eng',
						label:      'Имя (ориг.)',
						hint:       'Имя (ориг.)',
					},
					{	type:       'TextField',
						name:       'image',
						label:      'Эмблема',
						hint:       'Эмблема клуба',
					},
					{	type:       'SelectField',
						name:       'country_id',
						label:      'Страна',
						hint:       'Страна',
						required:   true,
						items:      countries.map((country) => ({ value: country.id, text: country.name }))
					},
					{	type:       'SelectField',
						name:       'city_id',
						label:      'Город',
						hint:       'Город',
						required:   true,
						items:      cities.map((city) => ({ value: city.id, text: city.name }))
					},
					{	type:       'TextField',
						name:       'full_name',
						label:      'Полное название',
						hint:       'Полное название клуба',
					},
					{	type:       'TextField',
						name:       'foundation_year',
						label:      'Год основания',
						hint:       'Год основания клуба',
					},
					{	type:       'TextField',
						name:       'stadium_name',
						label:      'Стадион',
						hint:       'Название стадиона',
					},
					{	type:       'SelectField',
						name:       'trainer_id',
						label:      'Тренер',
						hint:       'Тренер',
						items:      trainers.map((trainer) => ({ value: trainer.id, text: `${trainer.name} ${trainer.surname}` }))
					},
					{	type:       'TextField',
						name:       'site',
						label:      'Сайт',
						hint:       'Сайт клуба',
					},
					{	type:       'TextField',
						name:       'colors',
						label:      'Цвета',
						hint:       'Цвета клуба',
					},
					{	type:       'TextField',
						name:       'previous_names',
						label:      'Предыдущие названия',
						hint:       'Предыдущие названия клуба',
						multi_line: true,
						rows:       2,
					},
				]
				break
			}
			case 'players': {
				const { fcs, countries, lines } = this.props
				fields = [
					{	type:       'TextField',
						name:       'name',
						label:      'Имя',
						hint:       'Имя',
						required:   true,
					},
					{	type:       'TextField',
						name:       'surname',
						label:      'Фамилия',
						hint:       'Фамилия',
						required:   true,
					},
					{	type:       'TextField',
						name:       'name_eng',
						label:      'Имя (ориг.)',
						hint:       'Имя (ориг.)',
					},
					{	type:       'TextField',
						name:       'surname_eng',
						label:      'Фамилия (ориг.)',
						hint:       'Фамилия (ориг.)',
					},
					{	type:       'SelectField',
						name:       'fc_id',
						label:      'Команда',
						hint:       'Команда',
						items:      fcs.map((fc) => ({ value: fc.id, text: fc.name }))
					},
					{	type:       'SelectField',
						name:       'country_id',
						label:      'Страна',
						hint:       'Страна',
						required:   true,
						items:      countries.map((country) => ({ value: country.id, text: country.name }))
					},
					{	type:       'DatePicker',
						name:       'birth_date',
						hint:       'Дата рождения',
					},
					{	type:       'TextField',
						name:       'player_number',
						label:      'Номер',
						hint:       'Номер игрока',
					},
					{	type:       'SelectField',
						name:       'line_id',
						label:      'Амплуа',
						hint:       'Амплуа',
						required:   true,
						items:      lines.map((line) => ({ value: line.id, text: line.name }))
					},
					{	type:       'TextField',
						name:       'weight',
						label:      'Вес',
						hint:       'Вес игрока',
					},
					{	type:       'TextField',
						name:       'growth',
						label:      'Рост',
						hint:       'Рост игрока',
					},
				]
				break
			}
			case 'trainers': {
				fields = [
					{	type:       'TextField',
						name:       'name',
						label:      'Имя',
						hint:       'Имя',
						required:   true,
					}, 
					{	type:       'TextField',
						name:       'surname',
						label:      'Фамилия',
						hint:       'Фамилия',
						required:   true,
					}, 
				]
				break
			}
			case 'countries': {
				fields = [
					{	type:       'TextField',
						name:       'name',
						label:      'Название',
						hint:       'Название',
						required:   true,
					},
					{	type:       'TextField',
						name:       'short_name',
						label:      'Сокращенное название',
						hint:       'Сокращенное название',
						required:   true,
					}, 
				]
				break
			}
			case 'cities': {
				const { countries } = this.props
				fields = [
					{	type:       'TextField',
						name:       'name',
						label:      'Название',
						hint:       'Название',
						required:   true,
					}, 
					{	type:       'SelectField',
						name:       'country_id',
						label:      'Страна',
						hint:       'Страна',
						required:   true,
						items:      countries.map((country) => ({ value: country.id, text: country.name }))
					}, 
				]
				break
			}
			case 'lines': {
				fields = [
					{	type:       'TextField',
						name:       'name',
						label:      'Название',
						hint:       'Название',
						required:   true,
					}, 
					{	type:       'TextField',
						name:       'short_name',
						label:      'Сокращенное название',
						hint:       'Сокращенное название',
						required:   true,
					}, 
				]
				break
			}
			case 'matches': {
				const { seasons, fcs } = this.props
				const fcs_items = fcs.map((fc) => ({ value: fc.id, text: fc.name }))
				fields = [
					{	type:       'SelectField',
						name:       'season_id',
						label:      'Сезон',
						hint:       'Сезон',
						items:      seasons.map((season) => ({ value: season.id, text: `${season.championat_name} (${season.year_begin}-${season.year_end})` }))
					}, 
					{	type:       'SelectField',
						name:       'home_fc_id',
						label:      'Команда дома',
						hint:       'Команда дома',
						required:   true,
						items:      fcs_items,
					},
					{	type:       'SelectField',
						name:       'away_fc_id',
						label:      'Команда в гостях',
						hint:       'Команда в гостях',
						required:   true,
						items:      fcs_items,
					},
					{	type:       'TextField',
						name:       'tour',
						label:      'Тур',
						hint:       'Тур',
					},
					{	type:       'TextField',
						name:       'score_home',
						label:      'Счет дома',
						hint:       'Счет дома',
					},
					{	type:       'TextField',
						name:       'score_away',
						label:      'Счет в гостях',
						hint:       'Счет в гостях',
					},
					{	type:       'DatePicker',
						name:       'match_date',
						hint:       'Дата проведения матча',
						required:   true,
					},
					{	type:       'TimePicker',
						name:       'match_time',
						hint:       'Время проведения матча',
						required:   true,
					},
					{	type:       'Checkbox',
						name:       'is_over',
						label:      'Закончен?',
					},
				]
				break
			}
		}

		return fields.map((field, i) => {
			switch (field.type) {
				case 'TextField': {
					return <div key={i}>
						<Field 
							name={field.name}
							component={TextField}
							hintText={field.hint}
							floatingLabelText={field.label}
							validate={field.required ? required : null}
							fullWidth={true}
							multiLine={field.multi_line ? true : false}
							rows={field.rows ? field.rows : 1}
						/>
					</div>
				}
				case 'SelectField': {
					return <div key={i}>
						<Field
							name={field.name}
							component={SelectField}
							hintText={field.hint}
							floatingLabelText={field.label}
							validate={field.required ? required : null}
							fullWidth={true}
						>
							{ field.items.map((item) => <MenuItem key={item.value} value={item.value} primaryText={item.text} />) }
						</Field>
					</div>
				}
				case 'Checkbox': {
					return <div key={i}>
						<Field
							name={field.name}
							component={Checkbox}
							label={field.label}
						/>
					</div>
				}
				case 'DatePicker': {
					return <div key={i}>
						<Field
							name={field.name}
							component={DatePicker}
							format={null}
							hintText={field.hint}
							validate={field.required ? required : null}
							fullWidth={true}
						/>
					</div>
				}
				case 'TimePicker': {
					return <div key={i}>
						<Field
							name={field.name}
							component={TimePicker}
							format={null}
							hintText={field.hint}
							validate={field.required ? required : null}
							fullWidth={true}
						/>
					</div>
				}
				default: return null
			}
		})
	}

	render() {
		const { handleSubmit, action_type, on_cancel, submitting } = this.props

		const submit_title = (action_type === 'new') ? 'Добавить' : (action_type === 'edit') ? 'Сохранить' : 'Error'

		return (
			<form onSubmit={handleSubmit}>
				{ this.render_fields() }
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
	table_name:    React.PropTypes.string,
	countries:     React.PropTypes.array,
	championats:   React.PropTypes.array,
	seasons:       React.PropTypes.array,
	fcs:           React.PropTypes.array,
	trainers:      React.PropTypes.array,
	cities:        React.PropTypes.array,
	lines:         React.PropTypes.array,
	action_type:   React.PropTypes.string,
	submitting:    React.PropTypes.bool,
	on_cancel:     React.PropTypes.func,
	required:      React.PropTypes.func,
	handleSubmit:  React.PropTypes.func,
	initialValues: React.PropTypes.object,
}

export default reduxForm({
	form: 'admin_form'
})(ChampionatForm)

