import React, { Component }  from 'react'
import { connect }           from 'react-redux'
import { Link }              from 'react-router'
import * as actions          from '../actions/AdminTable'
import RaisedButton          from 'material-ui/RaisedButton'
import FontIcon              from 'material-ui/FontIcon'
import { red500, yellow700 } from 'material-ui/styles/colors'
import SelectField           from 'material-ui/SelectField'
import MenuItem              from 'material-ui/MenuItem'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'
import FlagLink              from '../components/FlagLink'

class AdminTable extends Component {

	constructor(props) {
		super(props)
		this.state = { value: 0 }

		this.handleChange = this.handleChange.bind(this)
	}

	componentDidMount() {
		const { params, fetch_table } = this.props
		fetch_table(params.table)
	}

	componentDidUpdate(prev_props) {
		const { params, fetch_table } = this.props
		if (params.table !== prev_props.params.table) {
			fetch_table(params.table)
			this.setState({ current_row: null })
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
					{ TABLE_HEADERS[params.table].map((title, i) => (i === 0) ? (<TableHeaderColumn width="80px" key={i}>{title}</TableHeaderColumn>) : (<TableHeaderColumn key={i}>{title}</TableHeaderColumn>)) }
					<TableHeaderColumn width="70px"></TableHeaderColumn>
					<TableHeaderColumn width="70px"></TableHeaderColumn>
				</TableRow>
			</TableHeader>
		)

		switch (params.table) {
			case 'championats': {
				rows = data.map((champ) => (
					<TableRow key={champ.id}>
						<TableRowColumn>{champ.id}</TableRowColumn>
						<TableRowColumn>{champ.name}</TableRowColumn>
						<TableRowColumn>
							<FlagLink title={champ.country_name} flag={champ.country_short_name} />
						</TableRowColumn>
						<TableRowColumn>
							<Link to={`/admin/championats/edit/${champ.id}`}><FontIcon className="material-icons" color={yellow700}>edit</FontIcon></Link>
						</TableRowColumn>
						<TableRowColumn>
							<FontIcon onClick={() => console.log(champ.id)} style={{cursor: 'pointer'}} className="material-icons" color={red500}>delete</FontIcon>
						</TableRowColumn>
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
						<TableRowColumn>
							{ !fc.image ? null : <img alt={fc.name} src={`/img/logos/small/${fc.image}`} /> }
							{' '}
							{fc.name}
						</TableRowColumn>
						<TableRowColumn>
							<FlagLink title={fc.country_name} flag={fc.country_short_name} />
						</TableRowColumn>
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
				rows = data.map((country) => (
					<TableRow key={country.id}>
						<TableRowColumn>{country.id}</TableRowColumn>
						<TableRowColumn>
							<FlagLink title={country.name} flag={country.short_name} />
						</TableRowColumn>
						<TableRowColumn>{country.short_name}</TableRowColumn>
						<TableRowColumn>
							<Link to={`/admin/championats/edit/${country.id}`}><FontIcon className="material-icons" color={yellow700}>edit</FontIcon></Link>
						</TableRowColumn>
						<TableRowColumn>
							<Link to={''}><FontIcon className="material-icons" color={red500}>delete</FontIcon></Link>
						</TableRowColumn>
					</TableRow>
				))
				break
			}

			case 'cities': {
				rows = data.map((city) => (
					<TableRow key={city.id}>
						<TableRowColumn>{city.id}</TableRowColumn>
						<TableRowColumn>{city.name}</TableRowColumn>
						<TableRowColumn>
							<FlagLink title={city.country_name} flag={city.country_short_name} />
						</TableRowColumn>
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

	handleChange(event, index, value) {
		this.setState({value})
	}

	render() {
		const { error, fetching, params, data } = this.props

		if (error)    return <div>ERROR</div>
		if (fetching) return <div>Loading...</div>

		const table = this.prepare_table_data()

		// console.log(this.state)

		const filter = (params.table !== 'fcs') ? null : data.map((fc) => (<MenuItem key={fc.id} value={fc.id} primaryText={fc.name} />))

		return (
			<div>
				<div style={{height: '45px'}}>
					<h4 style={{padding: '0 0 10px', float: 'left'}}>{params.table}</h4>
					<RaisedButton label="Добавить" primary={true} style={{float: 'right'}} icon={<FontIcon className="material-icons">add</FontIcon>} />
				</div>
				
				<div>
					<SelectField
						floatingLabelText="Команда"
						hintText="Выберите команду"
						value={this.state.value}
						onChange={this.handleChange}
						autoWidth={true}
					>
						{filter}
					</SelectField>
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
	params:             React.PropTypes.object,
	data:               React.PropTypes.array,
	current_row:        React.PropTypes.number,
	fetching:           React.PropTypes.bool,
	error:              React.PropTypes.any,
	fetch_table:        React.PropTypes.func,
}

function mapStateToProps(state) {
	return {
		data:        state.admin.data,
		fetching:    state.admin.fetching,
		error:       state.admin.error,
	}
}

export default connect(mapStateToProps, actions)(AdminTable)