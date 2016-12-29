import { combineReducers } from 'redux'
import championat          from './Championat'
import season              from './Season'
import fcs                 from './FootballClubList'
import fc                  from './FootballClub'
import players             from './PlayerList'
import player              from './Player'
import matches             from './MatchList'

const rootReducer = combineReducers({
	championat,
	season,
	fcs,
	fc,
	players,
	player,
	matches,
})

export default rootReducer