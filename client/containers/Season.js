import React, { Component } from 'react'
import { connect }          from 'react-redux'
import * as actions         from '../actions/Season'
import ErrorMessage         from '../components/ErrorMessage'
import Loading              from '../components/Loading'
import MatchesTable         from '../components/MatchesTable'
import LeagueTable          from '../components/LeagueTable'


class Season extends Component {
	componentDidMount() {
		const { params, fetch_season_matches } = this.props
		fetch_season_matches(params.champ_id, params.years)
	}

	componentDidUpdate(prev_props) {
		const { params, fetch_season_matches } = this.props
		if (params.years !== prev_props.params.years) {
			fetch_season_matches(params.champ_id, params.years)
		}
	}

	render() {
		const { next_matches, last_matches, league_table, fetching, error } = this.props

		if (error)    return <ErrorMessage message={error} />
		if (fetching) return <Loading />

		return (
			<div className="row">
				<div className="col-xl-6 col-lg-12">
					<div className="col-xl-12 col-lg-12">
						<h5>Прошедшие матчи</h5>
						<MatchesTable matches={next_matches} />
					</div>
					<div className="col-xl-12 col-lg-12">
						<h5>Будущие матчи</h5>
						<MatchesTable matches={last_matches} />
					</div>
				</div>
				<div className="col-xl-6 col-lg-12">
					<h5>Турнирная таблица</h5>
					<LeagueTable fcs={league_table} />
				</div>
			</div>
		)
	}
}

Season.propTypes = {
	last_matches:         React.PropTypes.any,
	next_matches:         React.PropTypes.any,
	league_table:         React.PropTypes.array,
	fetching:             React.PropTypes.bool,
	error:                React.PropTypes.object,
	params:               React.PropTypes.object,
	fetch_season_matches: React.PropTypes.func,
}


function mapStateToProps(state) {
	return {
		last_matches: state.season.last_matches,
		next_matches: state.season.next_matches,
		league_table: state.season.league_table,
		fetching:     state.season.fetching,
		error:        state.season.error,
	}
}

export default connect(mapStateToProps, actions)(Season)