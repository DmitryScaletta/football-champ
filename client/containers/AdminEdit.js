import React, { Component }  from 'react'
import { connect }           from 'react-redux'
import { Link }              from 'react-router'
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

export default connect(mapStateToProps, actions)(AdminEdit)