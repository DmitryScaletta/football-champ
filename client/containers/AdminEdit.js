import React, { Component }  from 'react'
import { connect }           from 'react-redux'
import { Link }              from 'react-router'
import { Field, reduxForm }  from 'redux-form'
import TextField             from 'material-ui/TextField'
// import RaisedButton          from 'material-ui/RaisedButton'
// import FontIcon              from 'material-ui/FontIcon'
import * as actions          from '../actions/AdminEdit'
import { invalidate_data }   from '../actions/AdminTable'
// import { fetch_countries }   from '../../actions/'
import ChampionatForm        from './forms/ChampionatForm'


class AdminEdit extends Component {

	fetch_record(table, id) {
		const {
			fetch_record_championat,
			fetch_record_season,
			fetch_record_fc,
			fetch_record_trainer,
			fetch_record_country,
			fetch_record_city,
			fetch_record_line,
			fetch_record_player,
			fetch_record_match,
		} = this.props

		switch (table) {
			case 'championats': { fetch_record_championat(id) } break
			case 'seasons':     { fetch_record_season(id)     } break
			case 'fcs':         { fetch_record_fc(id)         } break
			case 'trainers':    { fetch_record_trainer(id)    } break
			case 'countries':   { fetch_record_country(id)    } break
			case 'cities':      { fetch_record_city(id)       } break
			case 'lines':       { fetch_record_line(id)       } break
			case 'players':     { fetch_record_player(id)     } break
			case 'matches':     { fetch_record_match(id)      } break

			default: return false
		}

		return true
	}

	constructor(props) {
		super(props)

		this.on_submit = this.on_submit.bind(this)
	}

	componentDidMount() {
		const { params } = this.props
		this.fetch_record(params.table, params.id)
	}

	componentDidUpdate(prev_props) {
		const { params, location } = this.props
		if (params.table !== prev_props.params.table || location.pathname !== prev_props.location.pathname) {
			this.fetch_record(params.table, params.id)
		}
	}

	on_submit(data) {
		const { update_record, params, router } = this.props
		// console.log(data)
		update_record(params.table, data, () => {
			router.push(`/admin/${this.props.params.table}`)
		})
	}

	render_form() {
		const { params, data, countries, router } = this.props

		const onCancel = () => { router.push(`/admin/${this.props.params.table}`) }

		switch (params.table) {
			case 'championats': {
				// fetch countries
				return <ChampionatForm onCancel={onCancel} data={data} countries={countries} onSubmit={this.on_submit} />
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
		const { error, fetching, params, data } = this.props

		// console.log(data)

		if (error)    return <div>ERROR. {error}</div>
		if (fetching) return <div>Loading...</div>

		return (
			<div>
				<h3>{params.table + ' ' + params.id}</h3>
				{this.render_form()}
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
	valid:                   React.PropTypes.bool,
	fetching:                React.PropTypes.bool,
	error:                   React.PropTypes.any,
	fetch_record_championat: React.PropTypes.func,
	fetch_record_season:     React.PropTypes.func,
	fetch_record_fc:         React.PropTypes.func,
	fetch_record_trainer:    React.PropTypes.func,
	fetch_record_country:    React.PropTypes.func,
	fetch_record_city:       React.PropTypes.func,
	fetch_record_line:       React.PropTypes.func,
	fetch_record_player:     React.PropTypes.func,
	fetch_record_match:      React.PropTypes.func,
	update_record:           React.PropTypes.func,
	create_record:           React.PropTypes.func,
	router:                  React.PropTypes.object,
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
		valid:       state.admin.valid,
		fetching:    state.admin_edit.fetching,
		error:       state.admin_edit.error,
	}
}

export default connect(mapStateToProps, { ...actions, invalidate_data })(AdminEdit)