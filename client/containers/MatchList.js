import React, { Component } from 'react'
import { connect }          from 'react-redux'
import * as actions         from '../actions/MatchList'
import ErrorMessage         from '../components/ErrorMessage'
import Loading              from '../components/Loading'
import MatchesTable         from '../components/MatchesTable'


class MatchList extends Component {
	
	componentDidMount() {
		this.props.fetch_matches()
	}

	render() {
		const { error, fetching, next_matches, last_matches } = this.props

		if (error)    return <ErrorMessage message={error} />
		if (fetching) return <Loading />

		return (
			<div className="row">
				<div className="col-xl-6 col-lg-12">
					<h5>Прошедшие матчи</h5>
					<MatchesTable matches={next_matches} />
				</div>
				<div className="col-xl-6 col-lg-12">
					<h5>Будущие матчи</h5>
					<MatchesTable matches={last_matches} />
				</div>
			</div>
		)
	}
}

MatchList.propTypes = {
	last_matches:  React.PropTypes.any,
	next_matches:  React.PropTypes.any,
	fetching:      React.PropTypes.bool,
	error:         React.PropTypes.object,
	params:        React.PropTypes.object,
	fetch_matches: React.PropTypes.func,
}


function mapStateToProps(state) {
	return {
		last_matches: state.matches.last_matches,
		next_matches: state.matches.next_matches,
		fetching:     state.matches.fetching,
		error:        state.matches.error,
	}
}

export default connect(mapStateToProps, actions)(MatchList)