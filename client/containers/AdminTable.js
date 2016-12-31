import React, { Component } from 'react'
import { connect }          from 'react-redux'
import { Link }             from 'react-router'
import * as actions         from '../actions/AdminTable'
import FlatButton           from 'material-ui/FlatButton'
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'

class AdminTable extends Component {

	componentDidMount() {
		const { params, fetch_table } = this.props
		fetch_table(params.table)
	}

	componentDidUpdate(prev_props) {
		const { params, fetch_table } = this.props
		if (params.table !== prev_props.params.table) {
			fetch_table(params.table)
		}
	}

	prepare_table_data() {
		const { params, data } = this.props

		let header = null
		let rows   = null

		if (!data) return {
			header,
			rows
		}

		const TABLE_HEADERS = {
			championats: [
				'ID',
				'Название',
				'Страна',
			],
			seasons: [
				'ID',
				'Чемпионат',
				'Начало',
				'Конец',
			],
			fcs: [
				'ID',
				'Название',
				'Страна',
				'Стадион',
			],
			players: [
				'ID',
				'Имя',
				'Команда',
				'Гражданство',
				'Дата рождения',
				'Амплуа',
			],
			trainers: [
				'ID',
				'Имя',
				'Фамилия',
			],
			countries: [
				'ID',
				'Название',
				'Сокращённое название',
			],
			cities: [
				'ID',
				'Название',
				'Страна',
			],
			lines: [
				'ID',
				'Название',
				'Сокращённое название',
			],
			matches: [
				'',
			]
		}

		header = (
			<TableHeader displaySelectAll={false} adjustForCheckbox={false}>
				<TableRow>
				{ TABLE_HEADERS[params.table].map((title, i) => (
					<TableHeaderColumn key={i}>{title}</TableHeaderColumn>
				)) }
				</TableRow>
			</TableHeader>
		)

		switch (params.table) {
			case 'championats': {
				rows = data.map((champ) => (
					<TableRow key={champ.id}>
						<TableRowColumn>{champ.id}</TableRowColumn>
						<TableRowColumn>{champ.name}</TableRowColumn>
						<TableRowColumn>{champ.country_name}</TableRowColumn>
					</TableRow>
				))
				break
			}

			case 'seasons': {
				rows = data.map((season) => (
					<TableRow key={season.id}>
						<TableRowColumn>{season.id}</TableRowColumn>
						<TableRowColumn>{season.championat_name}</TableRowColumn>
						<TableRowColumn>{season.year_begin}</TableRowColumn>
						<TableRowColumn>{season.year_end}</TableRowColumn>
					</TableRow>
				))
				break
			}

			case 'fcs': {
				rows = data.map((fc) => (
					<TableRow key={fc.id}>
						<TableRowColumn>{fc.id}</TableRowColumn>
						<TableRowColumn>{fc.name}</TableRowColumn>
						<TableRowColumn>{fc.country_name}</TableRowColumn>
						<TableRowColumn>{fc.stadium_name}</TableRowColumn>
					</TableRow>
				))
				break
			}

			case 'players': {
				rows = null/*data.map((player) => (
					<TableRow key={fc.id}>
						<TableRowColumn>{fc.id}</TableRowColumn>
						<TableRowColumn>{fc.name}</TableRowColumn>
						<TableRowColumn>{fc.country_name}</TableRowColumn>
						<TableRowColumn>{fc.stadium_name}</TableRowColumn>
					</TableRow>
				))*/
				break
			}

			case 'trainers': {
				rows = data.map((trainer) => (
					<TableRow key={trainer.id}>
						<TableRowColumn>{trainer.id}</TableRowColumn>
						<TableRowColumn>{trainer.name}</TableRowColumn>
						<TableRowColumn>{trainer.surname}</TableRowColumn>
					</TableRow>
				))
				break
			}

			case 'countries': {
				rows = data.map((county) => (
					<TableRow key={county.id}>
						<TableRowColumn>{county.id}</TableRowColumn>
						<TableRowColumn>{county.name}</TableRowColumn>
						<TableRowColumn>{county.short_name}</TableRowColumn>
					</TableRow>
				))
				break
			}

			case 'cities': {
				rows = data.map((city) => (
					<TableRow key={city.id}>
						<TableRowColumn>{city.id}</TableRowColumn>
						<TableRowColumn>{city.name}</TableRowColumn>
						<TableRowColumn>{city.country_name}</TableRowColumn>
					</TableRow>
				))
				break
			}

			case 'lines': {
				rows = data.map((line) => (
					<TableRow key={line.id}>
						<TableRowColumn>{line.id}</TableRowColumn>
						<TableRowColumn>{line.name}</TableRowColumn>
						<TableRowColumn>{line.short_name}</TableRowColumn>
					</TableRow>
				))
				break
			}

			case 'matches': {
				rows = null /*data.map((line) => (
					<TableRow key={line.id}>
						<TableRowColumn>{line.id}</TableRowColumn>
						<TableRowColumn>{line.name}</TableRowColumn>
						<TableRowColumn>{line.short_name}</TableRowColumn>
					</TableRow>
				))*/
				break
			}

			default:
				break
		}
		return {
			header,
			rows
		}
	}

	render() {
		const { error, fetching, params, data } = this.props

		if (error)    return <div>ERROR</div>
		if (fetching) return <div>Loading...</div>
		

		// const page_title = 'Чемпионаты'

		const table = this.prepare_table_data()

		return (
			<div>
				<h3 style={{padding: '0 0 10px'}}>{params.table}</h3>
						
				<Toolbar>
					<ToolbarGroup firstChild={true}>
						<FlatButton label="Добавить" />
						<FlatButton label="Изменить" disabled={true} />
						<FlatButton label="Удалить" disabled={true} />
					</ToolbarGroup>
				</Toolbar>
				
				<Table fixedHeader={true} height={650}>
					{table.header}
					<TableBody displayRowCheckbox={false}>
						{table.rows}
					</TableBody>
				</Table>
			</div>
		)
	}
}

AdminTable.propTypes = {
	params:       React.PropTypes.object,
	data:         React.PropTypes.array,
	fetching:     React.PropTypes.bool,
	error:        React.PropTypes.any,
	fetch_table:  React.PropTypes.func,
}

function mapStateToProps(state) {
	return {
		data:     state.admin.data,
		fetching: state.admin.fetching,
		error:    state.admin.error,
	}
}

export default connect(mapStateToProps, actions)(AdminTable)