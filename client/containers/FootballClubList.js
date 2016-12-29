import React, { Component } from 'react'
import { connect }          from 'react-redux'
import * as actions         from '../actions/FootballClubList'
import ErrorMessage         from '../components/ErrorMessage'
import Loading              from '../components/Loading'
import FootballClubTable    from '../components/FootballClubTable'

class FootballClubList extends Component {

	componentDidMount() {
		this.props.fetch_football_clubs()
	}

	// componentDidUpdate(prevProps) {}

	render() {
		const { error, fetching } = this.props

		if (error)    return <ErrorMessage message={error} />
		if (fetching) return <Loading />

		return (
			<div className="row">
				<h2>Команды</h2>
				<FootballClubTable fcs={this.props.fcs} />
			</div>
		)
	}
}

FootballClubList.propTypes = {
	params:               React.PropTypes.object,
	fetching:             React.PropTypes.bool,
	error:                React.PropTypes.any,
	fcs:                  React.PropTypes.array,
	fetch_football_clubs: React.PropTypes.func,
}

function mapStateToProps(state) {
	return {
		fcs:      state.fcs.items,
		fetching: state.fcs.fetching,
		error:    state.fcs.error,
	}
}

export default connect(mapStateToProps, actions)(FootballClubList)