import React, { Component }  from 'react'
import { connect }           from 'react-redux'
import { Link }              from 'react-router'
import * as actions          from '../actions/AdminEdit'
// import RaisedButton          from 'material-ui/RaisedButton'
// import FontIcon              from 'material-ui/FontIcon'
// import { red500, yellow700 } from 'material-ui/styles/colors'
// import SelectField           from 'material-ui/SelectField'
// import MenuItem              from 'material-ui/MenuItem'
// import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'
// import FlagLink              from '../components/FlagLink'

class AdminEdit extends Component {

	componentDidMount() {
		// const { params, fetch_table } = this.props
		// fetch_table(params.table)
	}

	componentDidUpdate(prev_props) {
		// const { params, fetch_table } = this.props
		// if (params.table !== prev_props.params.table) {
			// fetch_table(params.table)
			// this.setState({ current_row: null })
		// }
	}


	render() {
		const { error, fetching, params } = this.props

		if (error)    return <div>ERROR</div>
		if (fetching) return <div>Loading...</div>

		return (
			<div>
				{params.table + ' ' + params.id}
				
			</div>
		)
	}
}

AdminEdit.propTypes = {
	params:             React.PropTypes.object,
	data:               React.PropTypes.array,
	current_row:        React.PropTypes.number,
	fetching:           React.PropTypes.bool,
	error:              React.PropTypes.any,
	fetch_table:        React.PropTypes.func,
}

function mapStateToProps(state) {
	return {
		data:        state.admin.data,
		fetching:    state.admin.fetching,
		error:       state.admin.error,
	}
}

export default connect(mapStateToProps, actions)(AdminEdit)