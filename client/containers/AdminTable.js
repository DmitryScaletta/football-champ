import React, { Component }     from 'react'
import { connect }              from 'react-redux'
import { Link }                 from 'react-router'
import Dialog                   from 'material-ui/Dialog'
import Snackbar                 from 'material-ui/Snackbar'
import RaisedButton             from 'material-ui/RaisedButton'
import FlatButton               from 'material-ui/FlatButton'
import FontIcon                 from 'material-ui/FontIcon'
import { red500, yellow700 }    from 'material-ui/styles/colors'
import SelectField              from 'material-ui/SelectField'
import MenuItem                 from 'material-ui/MenuItem'
import { 
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn
} from 'material-ui/Table'
import * as actions             from '../actions/AdminTable'
import { fetch_football_clubs } from '../actions/FootballClubList'
import { 
	delete_record,
	clear_affected_data
} from '../actions/AdminEdit'
import FlagLink                 from '../components/FlagLink'
import FootballClubLink         from '../components/FootballClubLink'
import DateTime                 from '../components/DateTime'


class AdminTable extends Component {

	constructor(props) {
		super(props)

		this.state = {
			open: false,
			id: 0,
		}

		this.handle_change = this.handle_change.bind(this)
		this.handle_open = this.handle_open.bind(this)
		this.handle_close = this.handle_close.bind(this)
		this.handle_confirm_delete = this.handle_confirm_delete.bind(this)
	}

	componentDidMount() {
		const { params, fetch_table, fetch_football_clubs } = this.props
		if (params.table === 'players' || params.table === 'matches') {
			fetch_football_clubs()
		} else {
			fetch_table(params.table)
		}
	}

	componentDidUpdate(prev_props) {
		const { params, current_fc, fetch_table, fetch_football_clubs, admin_clear_data } = this.props
		if (params.table !== prev_props.params.table) {
			if (params.table === 'players' || params.table === 'matches') {
				admin_clear_data()
				fetch_football_clubs()
			} else {
				fetch_table(params.table)
			}
		}
		if (current_fc !== prev_props.current_fc) {
			// fetch players or matches
			fetch_table(params.table, current_fc)
		}
	}

	handle_open(id) {
		this.setState({ open: true, id })
	}

	handle_close() {
		this.setState({ open: false })
	}

	handle_confirm_delete() {
		const { delete_record, params, fetch_table, current_fc } = this.props
		delete_record(params.table, this.state.id, () => {
			fetch_table(params.table, current_fc)
			this.setState({ open: false, id: 0 })
		})
	}

	prepare_table_data() {
		const { params, data,  } = this.props

		let header = null
		let rows   = null

		if (!data) return { header, rows }

		const table_headers = {
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
			'season-fcs': [
				'ID',
				'Сезон',
				'Команда',
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
				'Гражданство',
				'Дата рождения',
				'Амплуа',
			],
			trainers: [
				'ID',
				'Имя',
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
				'ID',
				'Команда дома',
				'Счет',
				'Команда в гостях',
				'Дата',
				'Закончен?',
			]
		}

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

			case 'season-fcs': {
				rows_data = data.map((season_fc) => [
					season_fc.id,
					`${season_fc.championat_name} (${season_fc.season_year_begin}-${season_fc.season_year_end})`,
					<FootballClubLink name={season_fc.fc_name} image={season_fc.fc_image} />,
				])
				break
			}

			case 'fcs': {
				rows_data = data.map((fc) => [
					fc.id,
					<FootballClubLink name={fc.name} image={fc.image} />,
					<FlagLink title={fc.country_name} flag={fc.country_short_name} />,
					fc.stadium_name,
				])
				break
			}

			case 'players': {
				rows_data = data.map((player) => [
					player.id,
					`${player.name} ${player.surname}`,
					<FlagLink title={player.country_name} flag={player.country_short_name} />,
					<DateTime timestamp={player.birth_date} format={'L'} years={true} />,
					player.line_name,
				])
				break
			}

			case 'trainers': {
				rows_data = data.map((trainer) => [
					trainer.id,
					`${trainer.name} ${trainer.surname}`,
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
				rows_data = data.map((match) => [
					match.id,
					<FootballClubLink name={match.home_fc_name} image={match.home_fc_image} />,
					(match.score_home === null) ? '-' : `${match.score_home} - ${match.score_away}`,
					<FootballClubLink name={match.away_fc_name} image={match.away_fc_image} />,
					<DateTime timestamp={match.match_date} format={'L LT'} />,
					(match.is_over) ? 'Да' : 'Нет',
				])
				break
			}

			default:
				break
		}

		header = (
			<TableHeader displaySelectAll={false} adjustForCheckbox={false}>
				<TableRow>
					{ table_headers[params.table].map((title, i) => {
						return (i === 0) ? 
							(<TableHeaderColumn width="80px" key={i}>{title}</TableHeaderColumn>) : 
							(<TableHeaderColumn key={i}>{title}</TableHeaderColumn>)
					}) }
					<TableHeaderColumn width="70px"></TableHeaderColumn>
					<TableHeaderColumn width="70px"></TableHeaderColumn>
				</TableRow>
			</TableHeader>
		)

		rows = rows_data.map((row) => (
			<TableRow key={row[0]}>
				{ row.map((col, i) => <TableRowColumn key={i}>{col}</TableRowColumn>) }
				<TableRowColumn>
					<Link to={`/admin/${params.table}/edit/${row[0]}`}><FontIcon className="material-icons" color={yellow700}>edit</FontIcon></Link>
				</TableRowColumn>
				<TableRowColumn>
					<FontIcon onClick={() => this.handle_open(row[0])} style={{cursor: 'pointer'}} className="material-icons" color={red500}>delete</FontIcon>
				</TableRowColumn>
			</TableRow>
		))
		
		return {
			header,
			rows
		}
	}

	handle_change(event, index, value) {
		this.props.change_current_fc(value)
	}

	render_fc_list() {
		const { fcs, current_fc, params } = this.props

		if (params.table !== 'players' && params.table !== 'matches') return null

		const filter = (fcs && fcs.length) ? fcs.map((fc) => (<MenuItem key={fc.id} value={fc.id} primaryText={fc.name} />)) : null

		return <div>
			<SelectField
				floatingLabelText="Команда"
				hintText="Выберите команду"
				value={current_fc}
				onChange={this.handle_change}
				autoWidth={true}
			>
				<MenuItem disabled={true} value={0} primaryText="Выберите команду" />
				{filter}
			</SelectField>
		</div>
	}

	render() {
		const { error, fetching, params, affected, last_action, clear_affected_data } = this.props

		if (error)    return <div>ERROR</div>
		if (fetching) return <div>Loading...</div>

		const table = this.prepare_table_data()

		const titles = {
			championats:  'Чемпионаты',
			seasons:      'Сезоны',
			'season-fcs': 'Команды в сезоне',
			fcs:          'Команды',
			players:      'Игроки',
			trainers:     'Тренеры',
			countries:    'Страны',
			cities:       'Города',
			lines:        'Амплуа',
			matches:      'Матчи',
		}

		const actions = [
			<FlatButton
				label="Нет"
				primary={true}
				onTouchTap={this.handle_close}
			/>,
			<FlatButton
				label="Да"
				primary={true}
				keyboardFocused={true}
				onTouchTap={this.handle_confirm_delete}
			/>,
		]

		
		let snackbar_title = ''
		switch (last_action) {
			case 'create': { snackbar_title = 'Создано записей: '   } break
			case 'update': { snackbar_title = 'Обновлено записей: ' } break
			case 'delete': { snackbar_title = 'Удалено записей: '   } break
		}

		const is_snackbar_open = (last_action !== '')

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
				
				{ this.render_fc_list() }
				
				<Table fixedHeader={false} selectable={false} >
					{table.header}
					<TableBody displayRowCheckbox={false} deselectOnClickaway={false}>
						{table.rows}
					</TableBody>
				</Table>

				<Dialog
					title="Удаление записи"
					actions={actions}
					modal={false}
					open={this.state.open}
					onRequestClose={this.handleClose}
				>
					Вы действительно хотите удалить запись?
				</Dialog>

				<Snackbar
					open={is_snackbar_open}
					message={`${snackbar_title} ${affected}`}
					autoHideDuration={4000}
					onRequestClose={clear_affected_data}
				/>
			</div>
		)
	}
}

AdminTable.propTypes = {
	params:               React.PropTypes.object,
	data:                 React.PropTypes.array,
	current_fc:           React.PropTypes.number,
	fcs:                  React.PropTypes.array,
	affected:             React.PropTypes.number,
	fetching:             React.PropTypes.bool,
	last_action:          React.PropTypes.oneOf(['', 'create', 'update', 'delete']),
	error:                React.PropTypes.any,
	fetch_table:          React.PropTypes.func,
	delete_record:        React.PropTypes.func,
	clear_affected_data:  React.PropTypes.func,
	fetch_football_clubs: React.PropTypes.func,
	change_current_fc:    React.PropTypes.func,
	admin_clear_data:     React.PropTypes.func,
}

function mapStateToProps(state) {
	return {
		data:        state.admin.data,
		current_fc:  state.admin.current_fc,
		fcs:         state.fcs.items,
		affected:    state.admin_edit.affected,
		last_action: state.admin_edit.last_action,
		fetching:    state.admin.fetching,
		error:       state.admin.error,
	}
}

export default connect(mapStateToProps, { 
	...actions,
	delete_record,
	fetch_football_clubs,
	clear_affected_data
})(AdminTable)