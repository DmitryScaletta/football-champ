import React, { Component } from 'react'
import { connect }          from 'react-redux'
import { Link }             from 'react-router'
import Moment               from 'moment'
import * as actions         from '../actions/Match'
import ErrorMessage         from '../components/ErrorMessage'
import Loading              from '../components/Loading'
import FlagLink             from '../components/FlagLink'

class Match extends Component {

	componentDidMount() {
		const { params, fetch_match } = this.props
		fetch_match(params.id)
	}

	// componentDidUpdate(prev_props) {}

	render() {
		const { error, fetching, match } = this.props

		if (error)    return <ErrorMessage message={error} />
		if (fetching) return <Loading />

		Moment.locale('ru')

		return (
			<div>
				<div className="row">
					<div className="col-xs-4 col-sm-4 col-md-4 col-lg-3 offset-lg-2" style={{textAlign: 'center'}}>
						<Link to={`/fc/${match.home_fc_id}`}>
							{ !match.home_fc_image ? null : <img alt={''} src={`/img/logos/orig/${match.home_fc_image}`} /> }
							<br />
							<h4>{match.home_fc_name}</h4>
						</Link>
					</div>
					<div className="col-xs-4 col-sm-4 col-md-4 col-lg-2" style={{textAlign: 'center'}}>
						<h2 style={{lineHeight: '110px'}}>{match.score_home} - {match.score_away}</h2>
					</div>
					<div className="col-xs-4 col-sm-4 col-md-4 col-lg-3" style={{textAlign: 'center'}}>
						<Link to={`/fc/${match.away_fc_id}`}>
							{ !match.home_fc_image ? null : <img alt={''} src={`/img/logos/orig/${match.away_fc_image}`} /> }
							<br />
							<h4>{match.away_fc_name}</h4>
						</Link>
					</div>
				</div>
				<div className="row">
					<div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 offset-lg-2">
						<h5>Детали</h5>
						<table className="table">
							<tbody>
								<tr>
									<td width="50%"><em>Статус:</em></td>
									<td>{ match.is_over ? 'Завершен' : 'Не начался' }</td>
								</tr>
								<tr>
									<td><em>Дата и время:</em></td>
									<td>{Moment.unix(match.match_date).format('LLL')}</td>
								</tr>
								<tr>
									<td><em>Чемпионат:</em></td>
									<td>
										<FlagLink
											title={match.championat_name} 
											flag={match.championat_country_short_name}
										/>
									</td>
								</tr>
								<tr>
									<td><em>Тур:</em></td>
									<td>{match.tour}</td>
								</tr>
								<tr>
									<td><em>Стадион:</em></td>
									<td>{match.stadium_name}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		)
	}
}

Match.propTypes = {
	params:      React.PropTypes.object,
	match:       React.PropTypes.object,
	fetching:    React.PropTypes.bool,
	error:       React.PropTypes.any,
	fetch_match: React.PropTypes.func,
}

function mapStateToProps(state) {
	return {
		match:    state.match.data,
		fetching: state.match.fetching,
		error:    state.match.error,
	}
}

export default connect(mapStateToProps, actions)(Match)