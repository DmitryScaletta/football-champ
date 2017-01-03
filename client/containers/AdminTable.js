import React, { Component }  from 'react'
import { connect }           from 'react-redux'
import { Link }              from 'react-router'
import RaisedButton          from 'material-ui/RaisedButton'
import FontIcon              from 'material-ui/FontIcon'
import { red500, yellow700 } from 'material-ui/styles/colors'
import SelectField           from 'material-ui/SelectField'
import MenuItem              from 'material-ui/MenuItem'
import AutoComplete          from 'material-ui/AutoComplete'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'
import * as actions          from '../actions/AdminTable'
import { delete_record }     from '../actions/AdminEdit'
import FlagLink              from '../components/FlagLink'

class AdminTable extends Component {

	/*constructor(props) {
		super(props)
		this.state = { value: 0 }

		this.handle_change = this.handle_change.bind(this)
	}*/

	componentDidMount() {
		const { params, fetch_table } = this.props
		fetch_table(params.table)
	}

	componentDidUpdate(prev_props) {
		const { params, fetch_table } = this.props
		if (params.table !== prev_props.params.table) {
			fetch_table(params.table)
			// this.setState({ current_row: null })
		}
	}

	prepare_table_data() {
		const { params, data, delete_record } = this.props

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
					{ TABLE_HEADERS[params.table].map((title, i) => {
						return (i === 0) ? 
							(<TableHeaderColumn width="80px" key={i}>{title}</TableHeaderColumn>) : 
							(<TableHeaderColumn key={i}>{title}</TableHeaderColumn>)
					}) }
					<TableHeaderColumn width="70px"></TableHeaderColumn>
					<TableHeaderColumn width="70px"></TableHeaderColumn>
				</TableRow>
			</TableHeader>
		)

		

		let rows_data = []

		switch (params.table) {
			case 'championats': {
				rows_data = data.map((champ) => [
					champ.id,
					champ.name,
					<FlagLink title={champ.country_name} flag={champ.country_short_name} />,
				])
				break
			}

			case 'seasons': {
				rows_data = data.map((season) => [
					season.id,
					season.championat_name,
					season.year_begin,
					season.year_end,
				])
				break
			}

			case 'fcs': {
				rows_data = data.map((fc) => [
					fc.id,
					<span>
						{ !fc.image ? null : <img alt={fc.name} src={`/img/logos/small/${fc.image}`} /> }
						{' '}
						{fc.name}
					</span>,
					<FlagLink title={fc.country_name} flag={fc.country_short_name} />,
					fc.stadium_name,
				])
				break
			}

			case 'players': {
				rows_data = []
				break
			}

			case 'trainers': {
				rows_data = data.map((trainer) => [
					trainer.id,
					trainer.name,
					trainer.surname
				])
				break
			}

			case 'countries': {
				rows_data = data.map((country) => [
					country.id,
					<FlagLink title={country.name} flag={country.short_name} />,
					country.short_name,
				])
				break
			}

			case 'cities': {
				rows_data = data.map((city) => [
					city.id,
					city.name,
					<FlagLink title={city.country_name} flag={city.country_short_name} />,
				])
				break
			}

			case 'lines': {
				rows_data = data.map((line) => [
					line.id,
					line.name,
					line.short_name
				])
				break
			}

			case 'matches': {
				rows_data = []
				break
			}

			default:
				break
		}

		// TODO add delete question
		const on_delete = (id) => { delete_record(params.table, id) }

		rows = rows_data.map((row) => (
			<TableRow key={row[0]}>
				{ row.map((col, i) => <TableRowColumn key={i}>{col}</TableRowColumn>) }
				<TableRowColumn>
					<Link to={`/admin/${params.table}/edit/${row[0]}`}><FontIcon className="material-icons" color={yellow700}>edit</FontIcon></Link>
				</TableRowColumn>
				<TableRowColumn>
					<FontIcon onClick={() => on_delete(row[0])} style={{cursor: 'pointer'}} className="material-icons" color={red500}>delete</FontIcon>
				</TableRowColumn>
			</TableRow>
		))
		
		


		return {
			header,
			rows
		}
	}

	/*handle_change(event, index, value) {
		this.setState({value})
	}*/

	render() {
		const { error, fetching, params, data } = this.props

		if (error)    return <div>ERROR</div>
		if (fetching) return <div>Loading...</div>

		const table = this.prepare_table_data()

		// console.log(this.state)

		// const filter = (params.table !== 'fcs') ? null : data.map((fc) => (<MenuItem key={fc.id} value={fc.id} primaryText={fc.name} />))
		//const filter = (params.table !== 'fcs' || !data) ? [] : data.map((fc) => { return { textKey: fc.name, valueKey: fc.id } })

		const data_source = (Array.isArray(data)) ? data : []

		const titles = {
			championats: 'Чемпионаты',
			seasons:     'Сезоны',
			fcs:         'Команды',
			players:     'Игроки',
			trainers:    'Тренеры',
			countries:   'Страны',
			cities:      'Города',
			lines:       'Амплуа',
			matches:     'Матчи',
		}

		return (
			<div>
				<div style={{height: '45px'}}>
					<h4 style={{padding: '0 0 10px', float: 'left'}}>{titles[params.table]}</h4>
					<Link to={`/admin/${params.table}/new`}>
						<RaisedButton 
							label="Добавить"
							primary={true}
							style={{float: 'right'}}
							icon={<FontIcon className="material-icons">add</FontIcon>}
						/>
					</Link>
				</div>
				
				<div>
					{/*<AutoComplete
						hintText="Type anything"
						dataSource={data_source}
						openOnFocus={true}
						filter={AutoComplete.caseInsensitiveFilter}
						dataSourceConfig={{text: 'name', value: 'id' }}
						// onUpdateInput={this.handleUpdateInput}
					/>
					<SelectField
						floatingLabelText="Команда"
						hintText="Выберите команду"
						value={this.state.value}
						onChange={this.handle_change}
						autoWidth={true}
					>
						{filter}
					</SelectField>*/}
				</div>
				
				<Table fixedHeader={false} selectable={false} >
					{table.header}
					<TableBody displayRowCheckbox={false} deselectOnClickaway={false}>
						{table.rows}
					</TableBody>
				</Table>
			</div>
		)
	}
}

AdminTable.propTypes = {
	params:        React.PropTypes.object,
	data:          React.PropTypes.array,
	fetching:      React.PropTypes.bool,
	error:         React.PropTypes.any,
	fetch_table:   React.PropTypes.func,
	delete_record: React.PropTypes.func,
}

function mapStateToProps(state) {
	return {
		data:     state.admin.data,
		fetching: state.admin.fetching,
		error:    state.admin.error,
	}
}

export default connect(mapStateToProps, { ...actions, delete_record })(AdminTable)