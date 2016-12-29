import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
// import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
// import Paper from 'material-ui/Paper'
// import IconButton from 'material-ui/IconButton'
// import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
// import NavigationClose from 'material-ui/svg-icons/navigation/close'
// import IconMenu from 'material-ui/IconMenu'
// import FontIcon from 'material-ui/FontIcon'
// import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more'
import DropDownMenu from 'material-ui/DropDownMenu'
// import RaisedButton from 'material-ui/RaisedButton'
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table'


//  style={this.state.open ? {paddingLeft: '256px'} : null}
// iconElementRight={<FlatButton label="Кнопка" />}
export default class Admin extends Component {

	constructor(props) {
		super(props)
		this.state = {open: false}

		this.handleToggle = this.handleToggle.bind(this)
		this.handleClose  = this.handleClose.bind(this)
	}

	handleToggle() { this.setState({open: !this.state.open}) }

	handleClose() { this.setState({open: false}) }

	render() {
		return (
			<div>
				<div>
					<AppBar
						title="Football Champ"
						onLeftIconButtonTouchTap={this.handleToggle}
					/>
					<div style={{padding: '20px'}}>
						<h3 style={{padding: '0 0 10px'}}>Чемпионаты</h3>
						
						<Toolbar>
							<ToolbarGroup firstChild={true}>
								<FlatButton label="Добавить" />
								<FlatButton label="Изменить" disabled={true} />
								<FlatButton label="Удалить" disabled={true} />
							</ToolbarGroup>
						</Toolbar>

						<Table>
							<TableHeader>
								<TableRow>
									<TableHeaderColumn>ID</TableHeaderColumn>
									<TableHeaderColumn>Name</TableHeaderColumn>
									<TableHeaderColumn>Status</TableHeaderColumn>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow>
									<TableRowColumn>1</TableRowColumn>
									<TableRowColumn>John Smith</TableRowColumn>
									<TableRowColumn>Employed</TableRowColumn>
								</TableRow>
								<TableRow>
									<TableRowColumn>2</TableRowColumn>
									<TableRowColumn>Randal White</TableRowColumn>
									<TableRowColumn>Unemployed</TableRowColumn>
								</TableRow>
								<TableRow>
									<TableRowColumn>3</TableRowColumn>
									<TableRowColumn>Stephanie Sanders</TableRowColumn>
									<TableRowColumn>Employed</TableRowColumn>
								</TableRow>
								<TableRow>
									<TableRowColumn>4</TableRowColumn>
									<TableRowColumn>Steve Brown</TableRowColumn>
									<TableRowColumn>Employed</TableRowColumn>
								</TableRow>
							</TableBody>
						</Table>

					</div>
				</div>
				<Drawer
					docked={false}
					open={this.state.open}
					onRequestChange={(open) => this.setState({open})}
				>
					<AppBar title="Таблицы" showMenuIconButton={false} />
					<MenuItem onTouchTap={this.handleClose} className="active">Чемпионаты</MenuItem>
					<MenuItem onTouchTap={this.handleClose}>Сезоны</MenuItem>
					<MenuItem onTouchTap={this.handleClose}>Команды</MenuItem>
					<MenuItem onTouchTap={this.handleClose}>Игроки</MenuItem>
					<MenuItem onTouchTap={this.handleClose}>Тренеры</MenuItem>
					<MenuItem onTouchTap={this.handleClose}>Страны</MenuItem>
					<MenuItem onTouchTap={this.handleClose}>Города</MenuItem>
					<MenuItem onTouchTap={this.handleClose}>Амплуа</MenuItem>
					<MenuItem onTouchTap={this.handleClose}>Матчи</MenuItem>
				</Drawer>
			</div>
		)
	}
}