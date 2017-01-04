import React, { Component } from 'react'
import { connect }          from 'react-redux'
import * as actions         from '../actions/AdminEdit'
import AdminForm            from './AdminForm'


class AdminEdit extends Component {

	constructor(props) {
		super(props)

		this.on_submit = this.on_submit.bind(this)
	}

	componentDidMount() {
		const { fetch_record, fetch_additional_tables, params } = this.props

		if (params.action === 'edit') {
			fetch_record(params.table, params.id)
		}
		fetch_additional_tables(params.table)
	}

	componentDidUpdate(prev_props) {
		const { fetch_additional_tables, fetch_record, params, location } = this.props
		
		if (params.table !== prev_props.params.table || location.pathname !== prev_props.location.pathname) {
			if (params.action === 'edit') {
				fetch_record(params.table, params.id)
			}
			fetch_additional_tables(params.table)
		}
	}

	on_submit(data) {
		const { create_record, update_record, params, router } = this.props
		
		const callback = () => router.push(`/admin/${this.props.params.table}`)
		
		let new_data = {}
		if (params.table === 'matches') {
			let match_date = data.match_date
			match_date.setHours  (data.match_time.getHours())
			match_date.setMinutes(data.match_time.getMinutes())
			new_data = {
				...data,
				match_date: match_date.getTime() / 1000
			}
			if (new_data.score_home === '') new_data.score_home = null
			if (new_data.score_away === '') new_data.score_away = null
		} else
		if (params.table === 'players') {
			new_data = {
				...data,
				birth_date: data.birth_date.getTime() / 1000
			}
		} else {
			new_data = data
		}

		if (params.action === 'new')  { create_record(params.table, new_data, callback) } else
		if (params.action === 'edit') { update_record(params.table, new_data, callback) }
	}

	render_form() {
		const { data, championats, seasons, fcs, trainers, countries, cities, lines, router, params } = this.props
		const action_type = (params.action === 'new' || params.action === 'edit') ? params.action : null
		const on_cancel = () => { router.push(`/admin/${this.props.params.table}`) }
		const required  = (value) => value == null ? 'Обязательное поле' : undefined

		let new_data 
		if (data.match_date && params.table === 'matches') {
			const match_date = new Date(Number(data.match_date) * 1000)
			new_data = {
				...data,
				match_date,
				match_time: match_date,
			}
		} else
		if (data.birth_date && params.table === 'players') {
			new_data = {
				...data,
				birth_date: new Date(Number(data.birth_date) * 1000)
			}
		} else {
			new_data = data
		}

		return <AdminForm
			initialValues={(params.action === 'edit') ? new_data : {}}
			table_name={params.table}
			action_type={action_type}
			championats={championats}
			seasons={seasons}
			fcs={fcs}
			trainers={trainers}
			countries={countries}
			cities={cities}
			lines={lines}
			on_cancel={on_cancel}
			required={required}
			onSubmit={this.on_submit} />
	}

	render() {
		const { error, fetching, fetching2, params } = this.props

		if (error)    return <div>ERROR. {error}</div>
		if (fetching) return <div>Loading...</div>

		const titles = {
			championats:  'Чемпионат',
			seasons:      'Сезон',
			'season-fcs': 'Команда в сезоне',
			fcs:          'Команда',
			players:      'Игрок',
			trainers:     'Тренер',
			countries:    'Страна',
			cities:       'Город',
			lines:        'Амплуа',
			matches:      'Матч',
		}

		const second_title = (params.action === 'new') ? 'Добавление' : (params.action === 'edit') ? 'Изменение' : ''

		return (
			<div style={{maxWidth: '600px', margin: '0 auto'}}>
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