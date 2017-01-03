import React, { Component } from 'react'
import { connect }          from 'react-redux'
import { Link }             from 'react-router'
import * as actions         from '../actions/Player'
import ErrorMessage         from '../components/ErrorMessage'
import Loading              from '../components/Loading'
import FlagLink             from '../components/FlagLink'
import FootballClubLink     from '../components/FootballClubLink'
import DateTime             from '../components/DateTime'

class Player extends Component {

	componentDidMount() {
		const { params, fetch_player } = this.props
		fetch_player(params.id)
	}

	// componentDidUpdate(prev_props) {}

	render() {
		const { error, fetching, player } = this.props

		if (error)    return <ErrorMessage message={error} />
		if (fetching) return <Loading />

		return (
			<div>
				<div className="row">
					<div className="col-xl-12">
						<h3>{player.name} {player.surname}</h3>
					</div>
				</div>
				<div className="row">
					<div className="col-xl-6">
						<h5>Детали</h5>
						<table className="table">
							<tbody>
								<tr width="40%">
									<td><em>Имя:</em></td>
									<td>{player.name} {player.surname} ({player.name_eng} {player.surname_eng})</td>
								</tr>
								<tr>
									<td><em>Гражданство:</em></td>
									<td>
										<FlagLink title={player.country_name} flag={player.country_short_name} />
									</td>
								</tr>
								<tr>
									<td><em>Дата рождения:</em></td>
									<td>
										<DateTime timestamp={player.birth_date} format={'LL'} years={true} />
									</td>
								</tr>
								{ !player.growth ? null : <tr>
									<td><em>Рост:</em></td>
									<td>{player.growth} см</td>
								</tr> }
								{ !player.weight ? null : <tr>
									<td><em>Вес:</em></td>
									<td>{player.weight} кг</td>
								</tr> }
								<tr>
									<td><em>Команда:</em></td>
									<td>
										<FootballClubLink id={player.fc_id} name={player.fc_name} image={player.fc_image} />
									</td>
								</tr>
								<tr>
									<td><em>Амплуа:</em></td>
									<td>{player.line_name}</td>
								</tr>
								{ !player.player_number ? null : <tr>
									<td><em>Номер:</em></td>
									<td>{player.player_number}</td>
								</tr> }
							</tbody>
						</table>
					</div>
				</div>
			</div>
		)
	}
}

Player.propTypes = {
	params:       React.PropTypes.object,
	player:       React.PropTypes.object,
	fetching:     React.PropTypes.bool,
	error:        React.PropTypes.any,
	fetch_player: React.PropTypes.func,
}

function mapStateToProps(state) {
	return {
		player:   state.player.data,
		fetching: state.player.fetching,
		error:    state.player.error,
	}
}

export default connect(mapStateToProps, actions)(Player)