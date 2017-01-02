import React, { Component }  from 'react'
import { connect }           from 'react-redux'
import { Link }              from 'react-router'
import { Field, reduxForm }  from 'redux-form'
import TextField             from 'material-ui/TextField'
import * as actions          from '../actions/AdminEdit'
// import RaisedButton          from 'material-ui/RaisedButton'
// import FontIcon              from 'material-ui/FontIcon'

class AdminEdit extends Component {

	componentDidMount() {
		const { params, fetch_record } = this.props
		fetch_record(params.table, params.id)
	}

	componentDidUpdate(prev_props) {
		const { params, fetch_record } = this.props
		if (params.table !== prev_props.params.table || params.table !== prev_props.params.table) {
			fetch_record(params.table, params.id)
		}
	}

	render_form() {
		const { params } = this.props

		switch (params.table) {
			case 'championats': {
				const renderTextField = ({ input, label, meta: { touched, error }, ...custom }) => (
					<TextField 
						hintText={label}
						floatingLabelText={label}
						errorText={touched && error}
						{...input}
						{...custom}
					/>
				)
				return (
					<div>
						<Field name="firstName" component={renderTextField} label="First Name"/>
					</div>
				)
			}
			/*case 'seasons':
			case 'fcs':
			case 'trainers':
			case 'countries':
			case 'cities':
			case 'lines':
			case 'players':
			case 'matches':*/

			default:            return null
		}

	}

	render() {
		const { error, fetching, params, data } = this.props

		console.log(data)

		if (error)    return <div>ERROR. {error}</div>
		if (fetching) return <div>Loading...</div>

		return (
			<div>
				{params.table + ' ' + params.id}
				<form onSubmit={(e) => { e.preventDefault() }}>
					{this.render_form()}
				</form>
			</div>
		)
	}
}

AdminEdit.propTypes = {
	params:        React.PropTypes.object,
	data:          React.PropTypes.object,
	affected:      React.PropTypes.number,
	fetching:      React.PropTypes.bool,
	error:         React.PropTypes.any,
	fetch_record:  React.PropTypes.func,
	update_record: React.PropTypes.func,
	create_record: React.PropTypes.func,
}

function mapStateToProps(state) {
	return {
		data:     state.admin_edit.data,
		affected: state.admin_edit.affected,
		fetching: state.admin_edit.fetching,
		error:    state.admin_edit.error,
	}
}

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'my_form',
})(AdminEdit))