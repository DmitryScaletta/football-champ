import React, { Component } from 'react'
import { connect }          from 'react-redux'
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
// import RaisedButton from 'material-ui/RaisedButton'

// import Paper from 'material-ui/Paper'
// import IconButton from 'material-ui/IconButton'
// import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
// import NavigationClose from 'material-ui/svg-icons/navigation/close'
// import IconMenu from 'material-ui/IconMenu'
// import FontIcon from 'material-ui/FontIcon'
// import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more'
import DropDownMenu from 'material-ui/DropDownMenu'
// import RaisedButton from 'material-ui/RaisedButton'

// import * as actions         from '../actions/Admin'



//  style={this.state.open ? {paddingLeft: '256px'} : null}
// iconElementRight={<FlatButton label="Кнопка" />}
class Admin extends Component {

	constructor(props) {
		super(props)
		this.state = {open: false}

		this.handleToggle = this.handleToggle.bind(this)
		this.handleClose  = this.handleClose.bind(this)
	}

	handleToggle() { this.setState({open: !this.state.open}) }

	handleClose(table) {
		this.setState({open: false})
		this.props.router.push(`/admin/${table}`)
	}

	render() {
		const { location } = this.props

		const active = {backgroundColor: 'rgba(0,0,0,.2)'}

		return (

			<div>
				<div>
					<AppBar
						title="Football Champ"
						onLeftIconButtonTouchTap={this.handleToggle}
					/>
					<div style={{padding: '20px', paddingLeft: '276px'}}>

						{this.props.children}

					</div>
				</div>
				<Drawer
					docked={true}
					open={true/*this.state.open*/}
					onRequestChange={(open) => this.setState({open})}
				>
					<AppBar title="Таблицы" showMenuIconButton={false} />
					<MenuItem onTouchTap={() => {this.handleClose('championats')}} style={(location.pathname === '/admin/championats') ? active : null}>Чемпионаты</MenuItem>
					<MenuItem onTouchTap={() => {this.handleClose('seasons')}}     style={(location.pathname === '/admin/seasons')     ? active : null}>Сезоны</MenuItem>
					<MenuItem onTouchTap={() => {this.handleClose('fcs')}}         style={(location.pathname === '/admin/fcs')         ? active : null}>Команды</MenuItem>
					<MenuItem onTouchTap={() => {this.handleClose('players')}}     style={(location.pathname === '/admin/players')     ? active : null}>Игроки</MenuItem>
					<MenuItem onTouchTap={() => {this.handleClose('trainers')}}    style={(location.pathname === '/admin/trainers')    ? active : null}>Тренеры</MenuItem>
					<MenuItem onTouchTap={() => {this.handleClose('countries')}}   style={(location.pathname === '/admin/countries')   ? active : null}>Страны</MenuItem>
					<MenuItem onTouchTap={() => {this.handleClose('cities')}}      style={(location.pathname === '/admin/cities')      ? active : null}>Города</MenuItem>
					<MenuItem onTouchTap={() => {this.handleClose('lines')}}       style={(location.pathname === '/admin/lines')       ? active : null}>Амплуа</MenuItem>
					<MenuItem onTouchTap={() => {this.handleClose('matches')}}     style={(location.pathname === '/admin/matches')     ? active : null}>Матчи</MenuItem>
				</Drawer>
			</div>
		)
	}
}

Admin.propTypes = {
	params:       React.PropTypes.object,
	router:       React.PropTypes.object,
	location:     React.PropTypes.object,
	children:     React.PropTypes.node,
}

function mapStateToProps(state) {
	return {
		// player:   state.player.data,
		// fetching: state.player.fetching,
		// error:    state.player.error,
	}
}

export default connect(mapStateToProps/*, actions*/)(Admin)