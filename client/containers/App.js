import React, { Component } from 'react'
import { Provider }         from 'react-redux'
import { hashHistory, Router, Route, IndexRoute } from 'react-router'
import Main                 from './Main'
import Home                 from '../components/Home'
import Championat           from './Championat'
import Season               from './Season'
import FootballClubList     from './FootballClubList'
import FootballClub         from './FootballClub'
import PlayerList           from './PlayerList'
import Player               from './Player'
import MatchList            from './MatchList'
import Match                from './Match'
import Admin                from './Admin'
import AdminTable           from './AdminTable'
import AdminEdit            from './AdminEdit'

export default class App extends Component {
	render() {
		return (
			<Provider store={this.props.store}>
				<Router history={hashHistory}>
					<Route path='/' component={Main}>
						<IndexRoute component={Home} />
						<Route path='championat' component={Championat}>
							<Route path=':champ_id/:years' component={Season} />
						</Route>
						<Route path='fcs' component={FootballClubList} />
						<Route path='fc/:id' component={FootballClub} />
						<Route path='players' component={PlayerList} />
						<Route path='player/:id' component={Player} />
						<Route path='matches' component={MatchList} />
						<Route path='match/:id' component={Match} />
					</Route>
					<Route path='/admin' component={Admin}>
						<Route path=':table' component={AdminTable} />
						<Route path=':table/:action(/:id)' component={AdminEdit} />
					</Route>
				</Router>
			</Provider>
		)
	}
}

App.propTypes = {
	store: React.PropTypes.object.isRequired
}