import React, { Component } from 'react'
import { connect }          from 'react-redux'
import * as actions         from '../actions/FootballClubList'
import ErrorMessage         from '../components/ErrorMessage'
import Loading              from '../components/Loading'
import FootballClubTable    from '../components/FootballClubTable'
import FlagLink             from '../components/FlagLink'

class FootballClubList extends Component {

	componentDidMount() {
		this.props.fetch_football_clubs()
	}

	// componentDidUpdate(prevProps) {}

	render() {
		const { error, fetching, fcs, filter, change_filter } = this.props

		if (error)    return <ErrorMessage message={error} />
		if (fetching) return <Loading />

		const countries = {}
		fcs.forEach((fc) => {
			if (countries[fc.country_id] === undefined) {
				countries[fc.country_id] = {
					name: fc.country_name,
					short_name: fc.country_short_name,
				}
			}
		})

		const nav_items = Object.keys(countries).map((key) => {
			return (
				<li key={key} className="nav-item">
					<FlagLink
						className={(filter === Number(key)) ? 'nav-link active' : 'nav-link'}
						to={''}
						title={countries[key].name}
						flag={countries[key].short_name}
						onClick={(e) => {
							if (filter !== Number(key)) change_filter(Number(key))
							e.preventDefault()
						}}
					/>
				</li>
			)
			
		})

		const filtered_fcs = (filter === 0) ? fcs : fcs.filter((fc) => fc.country_id === filter)

		return (
			<div>
				<div className="row">
					<h2>Команды</h2>
					<ul className="nav nav-pills">
						<li className="nav-item">
							<a href="#" className={(filter === 0) ? 'nav-link active' : 'nav-link'} onClick={(e) => {
								if (filter !== 0) change_filter(0)
								e.preventDefault()
							}}>Все</a>
						</li>
						{nav_items}
					</ul>
				</div>
				<div className="row">
					<FootballClubTable fcs={filtered_fcs} />
				</div>
			</div>
		)
	}
}

FootballClubList.propTypes = {
	params:               React.PropTypes.object,
	fetching:             React.PropTypes.bool,
	error:                React.PropTypes.any,
	fcs:                  React.PropTypes.array,
	filter:               React.PropTypes.number,
	fetch_football_clubs: React.PropTypes.func,
	change_filter:        React.PropTypes.func,
}

function mapStateToProps(state) {
	return {
		fcs:      state.fcs.items,
		filter:   state.fcs.filter,
		fetching: state.fcs.fetching,
		error:    state.fcs.error,
	}
}

export default connect(mapStateToProps, actions)(FootballClubList)