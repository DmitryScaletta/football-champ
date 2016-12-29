import React, { Component } from 'react'
import { Link }             from 'react-router'

export default class Home extends Component {
	render() {
		return (
			<div>
				<div className="row">
					<div className="col-xl-12">
						<h3>Football Champ</h3>
					</div>
				</div>
				<div className="row">
					<div className="col-xl-4 col-lg-5 col-md-7 col-sm-9 col-xs-12">
						<div className="list-group">
							<Link className="list-group-item" to="championat">Чемпионаты</Link>
							<Link className="list-group-item" to="fcs">Команды</Link>
							<Link className="list-group-item" to="player">Игроки</Link>
							<Link className="list-group-item" to="match">Матчи</Link>
							<Link className="list-group-item" to="search">Поиск</Link>
						</div>
					</div>
				</div>
			</div>
		)
	}
}