import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import championat          from './Championat'
import season              from './Season'
import fcs                 from './FootballClubList'
import fc                  from './FootballClub'
import players             from './PlayerList'
import player              from './Player'
import matches             from './MatchList'
import match               from './Match'
import search              from './Search'
import admin               from './AdminTable'
import admin_edit          from './AdminEdit'

const rootReducer = combineReducers({
	form: formReducer,
	championat,
	season,
	fcs,
	fc,
	players,
	player,
	matches,
	match,
	search,
	admin,
	admin_edit,
})

export default rootReducer