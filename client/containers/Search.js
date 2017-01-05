import React, { Component } from 'react'
import { connect }          from 'react-redux'
import { Link }             from 'react-router'
import * as actions         from '../actions/Search'
import ErrorMessage         from '../components/ErrorMessage'
import Loading              from '../components/Loading'
import FootballClubLink     from '../components/FootballClubLink'
import SearchForm           from '../components/SearchForm'


class MatchList extends Component {

	render() {
		const { error, fetching, fcs, players, text, fetch_search, set_search_text } = this.props

		if (error)    return <ErrorMessage message={error} />
		if (fetching) return <Loading />

		const handle_submit = (values) => {
			if (values.q !== undefined) {
				set_search_text(values.q)
				fetch_search(values.q)
			}
		}

		return (
			<div>
				<div className="row">
					<div className="col-xs-12">
						<h3>Поиск</h3>
						<SearchForm onSubmit={handle_submit} initialValues={{ q: text }} />
					</div>
				</div>
				{ (fcs.length) ? <div className="row">
					<div className="col-xs-12">
						<h5>Команды</h5>
						{ fcs.map((fc) => (<div key={fc.id}><FootballClubLink id={fc.id} name={fc.name} image={fc.image} /></div>)) }
					</div>
				</div> : null }
				{ (players.length) ? <div className="row">
					<div className="col-xs-12">
						<h5>Игроки</h5>
						{ players.map((player) => (<div key={player.id}><Link to={`player/${player.id}`}>{`${player.name} ${player.surname}`}</Link></div>)) }
					</div>
				</div> : null }
			</div>
		)
	}
}

MatchList.propTypes = {
	text:         React.PropTypes.string,
	fcs:          React.PropTypes.array,
	players:      React.PropTypes.array,
	fetching:     React.PropTypes.bool,
	error:        React.PropTypes.any,
	params:       React.PropTypes.object,
	fetch_search: React.PropTypes.func,
	set_search_text: React.PropTypes.func,
}

function mapStateToProps(state) {
	return {
		text:         state.search.text,
		fcs:          state.search.fcs,
		players:      state.search.players,
		fetching:     state.search.fetching,
		error:        state.search.error,
	}
}

export default connect(mapStateToProps, actions)(MatchList)