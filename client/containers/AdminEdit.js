import React, { Component }  from 'react'
import { connect }           from 'react-redux'
// import { Link }              from 'react-router'
// import { Field, reduxForm }  from 'redux-form'
// import TextField             from 'material-ui/TextField'
// import RaisedButton          from 'material-ui/RaisedButton'
// import FontIcon              from 'material-ui/FontIcon'
import * as actions          from '../actions/AdminEdit'
import ChampionatForm        from './forms/ChampionatForm'


class AdminEdit extends Component {

	constructor(props) {
		super(props)

		this.on_submit = this.on_submit.bind(this)
	}

	componentDidMount() {
		const { fetch_record, fetch_additional_tables, load_form_data, params } = this.props

		if (params.action === 'edit') {
			fetch_record(params.table, params.id)
			// load_form_data(data)
		}
		load_form_data({}) // TODO rename to clear data
		fetch_additional_tables(params.table)
	}

	componentDidUpdate(prev_props) {
		const { fetch_additional_tables, fetch_record, load_form_data, params, location, data } = this.props
		
		if (params.table !== prev_props.params.table || location.pathname !== prev_props.location.pathname) {
			if (params.action === 'edit') {
				fetch_record(params.table, params.id)
				// load_form_data(data)
			}
			fetch_additional_tables(params.table)
			load_form_data({})
		}
	}

	on_submit(data) {
		const { create_record, update_record, params, router } = this.props
		
		const callback = () => router.push(`/admin/${this.props.params.table}`)
		
		if (params.action === 'new')  { create_record(params.table, data, callback) } else
		if (params.action === 'edit') { update_record(params.table, data, callback) }
	}

	render_form() {
		const { params, data, countries, router } = this.props
		const action_type = (params.action === 'new' || params.action === 'edit') ? params.action : null
		const onCancel = () => { router.push(`/admin/${this.props.params.table}`) }

		switch (params.table) {
			case 'championats': {
				// fetch countries
				return <ChampionatForm
					initialValues={data}
					action_type={action_type}
					data={data}
					countries={countries}
					onCancel={onCancel}
					onSubmit={this.on_submit} />
			}
			/*case 'seasons':
			case 'fcs':
			case 'trainers':
			case 'countries':
			case 'cities':
			case 'lines':
			case 'players':
			case 'matches':*/

			default: return null
		}

	}

	render() {
		const { error, fetching, fetching2, params, data } = this.props

		if (error)    return <div>ERROR. {error}</div>
		if (fetching) return <div>Loading...</div>

		const titles = {
			championats: 'Чемпионат',
			seasons:     'Сезон',
			fcs:         'Команд',
			players:     'Игрок',
			trainers:    'Тренер',
			countries:   'Страна',
			cities:      'Город',
			lines:       'Амплуа',
			matches:     'Матч',
		}

		const second_title = (params.action === 'new') ? 'Добавление' : (params.action === 'edit') ? 'Изменение' : ''

		return (
			<div>
				<h3>{`${titles[params.table]}. ${second_title}`}</h3>
				{fetching2 ? null : this.render_form()}
			</div>
		)
	}
}

AdminEdit.propTypes = {
	params:                  React.PropTypes.object,
	data:                    React.PropTypes.object,
	affected:                React.PropTypes.number,
	championats:             React.PropTypes.array,
	seasons:                 React.PropTypes.array,
	fcs:                     React.PropTypes.array,
	trainers:                React.PropTypes.array,
	countries:               React.PropTypes.array,
	cities:                  React.PropTypes.array,
	lines:                   React.PropTypes.array,
	fetching:                React.PropTypes.bool,
	fetching2:               React.PropTypes.bool,
	error:                   React.PropTypes.any,
	error2:                  React.PropTypes.any,
	fetch_record:            React.PropTypes.func,
	update_record:           React.PropTypes.func,
	create_record:           React.PropTypes.func,
	fetch_additional_tables: React.PropTypes.func,
	load_form_data:          React.PropTypes.func,
	router:                  React.PropTypes.object,
	location:                React.PropTypes.object,
}

function mapStateToProps(state) {
	return {
		data:        state.admin_edit.data,
		affected:    state.admin_edit.affected,
		championats: state.admin_edit.championats,
		seasons:     state.admin_edit.seasons,
		fcs:         state.admin_edit.fcs,
		trainers:    state.admin_edit.trainers,
		countries:   state.admin_edit.countries,
		cities:      state.admin_edit.cities,
		lines:       state.admin_edit.lines,
		fetching:    state.admin_edit.fetching,
		fetching2:   state.admin_edit.fetching2,
		error:       state.admin_edit.error,
		error2:      state.admin_edit.error2,
	}
}

export default connect(mapStateToProps, actions)(AdminEdit)