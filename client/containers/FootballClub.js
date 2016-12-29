import React, { Component } from 'react'
import { connect }          from 'react-redux'
import { Link }             from 'react-router'
import * as actions         from '../actions/FootballClub'
import ErrorMessage         from '../components/ErrorMessage'
import Loading              from '../components/Loading'
import MatchesTable         from '../components/MatchesTable'
import PlayersTable         from '../components/PlayersTable'

class FootballClub extends Component {

	componentDidMount() {
		const { params, fetch_football_club } = this.props
		fetch_football_club(params.id)
	}

	componentDidUpdate(prev_props) {
		const { params, fetch_football_club } = this.props
		if (params.id !== prev_props.params.id) {
			fetch_football_club(params.id)
		}
	}

	render() {
		const { fc, players, last_matches, next_matches, fetching, error } = this.props

		if (error)    return <ErrorMessage message={error} />
		if (fetching) return <Loading />

		return (
			<div>
				<div className="row">
					<div className="col-sm-12">
						<div style={{ height: '80px', float: 'left', marginRight: '20px' }}>
							{ fc.image ? <img alt={fc.name} src={`/img/logos/orig/${fc.image}`} /> : null }
						</div>
						<h3 style={{ lineHeight: '80px', float: 'left' }}>
							{fc.name} ({fc.name_eng})
						</h3>
					</div>
				</div>
				<div className="row">
					<div className="col-lg-12 col-xl-6">
						<h5>Прошедшие матчи</h5>
						<MatchesTable matches={last_matches} />
					</div>
					<div className="col-lg-12 col-xl-6">
						<h5>Будущие матчи</h5>
						<MatchesTable matches={next_matches} />
					</div>
				</div>
				<div className="row">
					<div className="col-sm-6">
						<h5>Состав команды</h5>
						<PlayersTable players={players} />
					</div>
					<div className="col-sm-6">
						<h5>Информация о команде</h5>
						<table className="table">
							<tbody>
								<tr>
									<td width="40%"><em>Страна:</em></td>
									<td>
										<Link>
											{ fc.country_short_name ? <img className="country-flag" alt={fc.country_name} src={`/img/flags/${fc.country_short_name}.png`} /> : null }
											{' '}
											{fc.country_name}
										</Link>
									</td>
								</tr>
								<tr>
									<td><em>Город:</em></td>
									<td>{fc.city_name}</td>
								</tr>
								<tr>
									<td><em>Полное название:</em></td>
									<td>{fc.full_name}</td>
								</tr>
								<tr>
									<td><em>Год основания:</em></td>
									<td>{fc.foundation_year}</td>
								</tr>
								<tr>
									<td><em>Стадион:</em></td>
									<td>{fc.stadium_name}</td>
								</tr>
								<tr>
									<td><em>Главный тренер:</em></td>
									<td>{fc.trainer_name} {fc.trainer_surname}</td>
								</tr>
								<tr>
									<td><em>Официальный сайт:</em></td>
									<td>
										<a href={fc.site}>{fc.site}</a>
									</td>
								</tr>
								<tr>
									<td><em>Основные цвета:</em></td>
									<td>{fc.colors}</td>
								</tr>
								<tr>
									<td><em>Предыдущие названия:</em></td>
									<td>{fc.previous_names}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		)
	}
}

FootballClub.propTypes = {
	params:              React.PropTypes.object,
	fc:                  React.PropTypes.object,
	players:             React.PropTypes.array,
	last_matches:        React.PropTypes.array,
	next_matches:        React.PropTypes.array,
	fetching:            React.PropTypes.bool,
	error:               React.PropTypes.any,
	fetch_football_club: React.PropTypes.func,
}

function mapStateToProps(state) {
	return {
		fc:           state.fc.data,
		players:      state.fc.players,
		last_matches: state.fc.last_matches,
		next_matches: state.fc.next_matches,
		fetching:     state.fc.fetching,
		error:        state.fc.error,
	}
}

export default connect(mapStateToProps, actions)(FootballClub)