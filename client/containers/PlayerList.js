import React, { Component }     from 'react'
import { connect }              from 'react-redux'
import * as actions             from '../actions/PlayerList'
import { fetch_football_clubs } from '../actions/FootballClubList'
import ErrorMessage             from '../components/ErrorMessage'
import Loading                  from '../components/Loading'
import PlayersTableExtended     from '../components/PlayersTableExtended'


class PlayerList extends Component {

	constructor(props) {
		super(props)
		this.state = { value: 0 }

		this.handle_change = this.handle_change.bind(this)
	}

	componentDidMount() {
		this.props.fetch_football_clubs()
	}

	handle_change(event) {
		this.setState({value: event.target.value})
		if (event.target.value !== 0) this.props.fetch_players(event.target.value)
	}

	render() {
		const { error, fetching, players, fcs } = this.props

		if (error)    return <ErrorMessage message={error} />
		if (fetching) return <Loading />

		const select_list = fcs.map((fc) => <option key={fc.id} value={fc.id}>{fc.name}</option>)

		return (
			<div>
				<div className="row">
					<div className="col-lg-6">
						<h2>Игроки</h2>
						<div className="form-group">
							<label htmlFor="select-fc">Выберите команду</label>
							<select value={this.state.value} className="form-control" id="select-fc" onChange={this.handle_change}>
								<option value={0}></option>
								{select_list}
							</select>
						</div>
						
					</div>
				</div>
				<div className="row" style={{paddingTop: '0'}}>
					<div className="col-lg-12">
						<PlayersTableExtended players={players} />
					</div>
				</div>
			</div>
		)
	}
}

PlayerList.propTypes = {
	params:               React.PropTypes.object,
	fetching:             React.PropTypes.bool,
	error:                React.PropTypes.any,
	players:              React.PropTypes.array,
	fcs:                  React.PropTypes.array,
	fetch_players:        React.PropTypes.func,
	fetch_football_clubs: React.PropTypes.func,
}

function mapStateToProps(state) {
	return {
		fetching: state.players.fetching,
		error:    state.players.error,
		players:  state.players.items,
		fcs:      state.fcs.items,
	}
}

export default connect(mapStateToProps, { 
	...actions,
	fetch_football_clubs
})(PlayerList)