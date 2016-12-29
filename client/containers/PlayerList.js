import React, { Component } from 'react'
import { connect }          from 'react-redux'
// import { Link }             from 'react-router'
import TextField            from 'material-ui/TextField'
// import FlatButton           from 'material-ui/FlatButton'
import * as actions         from '../actions/PlayerList'
import ErrorMessage         from '../components/ErrorMessage'
import Loading              from '../components/Loading'
import PlayersTable         from '../components/PlayersTable'

class PlayerList extends Component {

	constructor(props) {
		super(props)
		this.state = { value: '' }

		this.handle_submit = this.handle_submit.bind(this)
	}

	componentDidMount() {
		// this.props.fetch_players('алек')
	}

	// componentDidUpdate(prevProps) {}

	handle_submit(event) {
		// this.props.fetch_players()
		event.preventDefault()
	}

	render() {
		const { error, fetching, players } = this.props

		if (error)    return <ErrorMessage message={error} />
		if (fetching) return <Loading />

		return (
			<div className="row">
				<div className="col-lg-12">
					<h2>Игроки</h2>
					<form onSubmit={this.handle_submit}>
						<TextField hintText="Поиск" onChange={() => {}} />
						{/*<FlatButton type="submit" label="Search" />*/}
					</form>
				</div>
				<div className="col-lg-6">
					<PlayersTable players={players} />
				</div>

			</div>
		)
	}
}

PlayerList.propTypes = {
	params:        React.PropTypes.object,
	fetching:      React.PropTypes.bool,
	error:         React.PropTypes.any,
	players:       React.PropTypes.array,
	fetch_players: React.PropTypes.func,
}

function mapStateToProps(state) {
	return {
		fetching: state.players.fetching,
		error:    state.players.error,
		players:  state.players.items,
	}
}

export default connect(mapStateToProps, actions)(PlayerList)