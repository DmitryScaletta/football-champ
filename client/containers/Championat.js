import React, { Component } from 'react'
import { connect }          from 'react-redux'
import { Link }             from 'react-router'
import * as actions         from '../actions/Championat'
import ErrorMessage         from '../components/ErrorMessage'
import Loading              from '../components/Loading'
import FlagLink             from '../components/FlagLink'


class Championat extends Component {

	componentDidMount() {
		this.props.fetch_championats()
	}

	// componentDidUpdate(prevProps) {}

	render() {
		const { error, fetching, championats, params } = this.props

		if (error)    return <ErrorMessage message={error} />
		if (fetching) return <Loading />
		
		let current_championat = null
		for (const champ of championats) {
			if (champ.id === Number(params.champ_id)) {
				current_championat = champ
				break
			}
		}

		let seasons = !current_championat ? [] : current_championat.seasons.map((season) => {
			const year_begin = Number(params.years.split('-')[0])
			return (year_begin === season.year_begin) ? (
				<Link 
					className="nav-link active" 
					key={season.season_id}
				>
					<strong>{season.year_begin}-{season.year_end}</strong>
				</Link>
			) : (
				<Link 
					className="nav-link" 
					key={season.season_id} 
					to={`championat/${current_championat.id}/${season.year_begin}-${season.year_end}`}
				>
					{season.year_begin}-{season.year_end}
				</Link>
			)
		})

		let champs = championats.map((champ) => {
			const last_season = champ.seasons[champ.seasons.length - 1]
			return (
				<FlagLink
					className={'list-group-item'}
					key={champ.id}
					to={`championat/${champ.id}/${last_season.year_begin}-${last_season.year_end}`}
					title={champ.name}
					flag={champ.country_short_name}
				/>
			)
		})

		return (
			<div>
				<div className="row">
					<div className="col-xl-9">
						<h3>{current_championat ? `${current_championat.name} (${current_championat.country_name})` : 'Чемпионаты'}</h3>
					</div>
					<div className="col-xl-3">
						<nav className="nav nav-inline" style={{lineHeight: '38px'}}>
							{seasons}
						</nav>
					</div>
				</div>
				{ (params.years || params.champ_id) ? null : 
				<div className="row">
					<div className="col-xl-4 col-lg-5 col-md-7 col-sm-9 col-xs-12">
						<div className="list-group">
							{ champs }
						</div>
					</div>
				</div>}
				{this.props.children}
			</div>
		)
	}
}

Championat.propTypes = {
	params:            React.PropTypes.object,
	fetching:          React.PropTypes.bool,
	error:             React.PropTypes.any,
	championats:       React.PropTypes.array,
	children:          React.PropTypes.node,
	router:            React.PropTypes.object,
	fetch_championats: React.PropTypes.func,
}

function mapStateToProps(state) {
	return {
		fetching:    state.championat.fetching,
		error:       state.championat.error,
		championats: state.championat.items,
	}
}

export default connect(mapStateToProps, actions)(Championat)