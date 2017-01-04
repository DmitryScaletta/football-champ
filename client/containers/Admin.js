import React, { Component } from 'react'
import AppBar               from 'material-ui/AppBar'
import Drawer               from 'material-ui/Drawer'
import MenuItem             from 'material-ui/MenuItem'
import FlatButton           from 'material-ui/FlatButton'


export default class Admin extends Component {

	constructor(props) {
		super(props)
		this.state = {open: false}

		this.handle_toggle = this.handle_toggle.bind(this)
		this.handle_close  = this.handle_close.bind(this)
	}

	handle_toggle() { this.setState({open: !this.state.open}) }

	handle_close(table) {
		this.setState({open: false})
		this.props.router.push(`/admin/${table}`)
	}

	render() {
		const { location, router } = this.props

		const active = {backgroundColor: 'rgba(0,0,0,.2)'}

		return (
			<div>
				<div>
					<AppBar
						style={{position: 'fixed'}}
						title="Football Champ"
						onLeftIconButtonTouchTap={this.handle_toggle}
						iconElementRight={<FlatButton onClick={() => router.push('/')} label="На главную" />}
					/>
					<div style={{padding: '84px 20px 20px 20px'}}>
						{this.props.children}
					</div>
				</div>
				<Drawer
					docked={false}
					open={this.state.open}
					onRequestChange={(open) => this.setState({open})}
				>
					<AppBar title="Таблицы" showMenuIconButton={false} />
					<MenuItem onTouchTap={() => {this.handle_close('championats')}} style={(location.pathname === '/admin/championats') ? active : null}>Чемпионаты</MenuItem>
					<MenuItem onTouchTap={() => {this.handle_close('seasons')}}     style={(location.pathname === '/admin/seasons')     ? active : null}>Сезоны</MenuItem>
					<MenuItem onTouchTap={() => {this.handle_close('season-fcs')}}  style={(location.pathname === '/admin/season-fcs')  ? active : null}>Команды в сезоне</MenuItem>
					<MenuItem onTouchTap={() => {this.handle_close('fcs')}}         style={(location.pathname === '/admin/fcs')         ? active : null}>Команды</MenuItem>
					<MenuItem onTouchTap={() => {this.handle_close('players')}}     style={(location.pathname === '/admin/players')     ? active : null}>Игроки</MenuItem>
					<MenuItem onTouchTap={() => {this.handle_close('trainers')}}    style={(location.pathname === '/admin/trainers')    ? active : null}>Тренеры</MenuItem>
					<MenuItem onTouchTap={() => {this.handle_close('countries')}}   style={(location.pathname === '/admin/countries')   ? active : null}>Страны</MenuItem>
					<MenuItem onTouchTap={() => {this.handle_close('cities')}}      style={(location.pathname === '/admin/cities')      ? active : null}>Города</MenuItem>
					<MenuItem onTouchTap={() => {this.handle_close('lines')}}       style={(location.pathname === '/admin/lines')       ? active : null}>Амплуа</MenuItem>
					<MenuItem onTouchTap={() => {this.handle_close('matches')}}     style={(location.pathname === '/admin/matches')     ? active : null}>Матчи</MenuItem>
				</Drawer>
			</div>
		)
	}
}

Admin.propTypes = {
	params:   React.PropTypes.object,
	router:   React.PropTypes.object,
	location: React.PropTypes.object,
	children: React.PropTypes.node,
}

