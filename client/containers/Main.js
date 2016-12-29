import React, { Component }   from 'react'
import { connect }            from 'react-redux'
import { Link }               from 'react-router'
// import * as actions           from '../actions/Main'

class Main extends Component {
	render() {
		const path = this.props.location.pathname
		return (
			<div>
				<nav className="navbar navbar-dark bg-primary">
					<div className="container">
						<Link className="navbar-brand mb-0" to=''>FOOTBALL</Link>
						<ul className="nav navbar-nav">
							<li className={(path.indexOf('/championat') === 0) ? 'nav-item active' : 'nav-item'}>
								<Link className="nav-link" to='championat'>Чемпионаты</Link>
							</li>
							<li className={(path.indexOf('/fc') === 0) ? 'nav-item active' : 'nav-item'}>
								<Link className="nav-link" to='fcs'>Команды</Link>
							</li>
							<li className={(path.indexOf('/player') === 0) ? 'nav-item active' : 'nav-item'}>
								<Link className="nav-link" to='players'>Игроки</Link>
							</li>
							<li className={(path.indexOf('/match') === 0) ? 'nav-item active' : 'nav-item'}>
								<Link className="nav-link" to='matches'>Матчи</Link>
							</li>
							<li className={(path.indexOf('/search') === 0) ? 'nav-item active' : 'nav-item'}>
								<Link className="nav-link" to='search'>Поиск</Link>
							</li>
							<li className={(path.indexOf('/admin') === 0) ? 'nav-item float-xs-right active' : 'nav-item float-xs-right'}>
								<Link className="nav-link" to='admin'>Админка</Link>
							</li>
						</ul>
					</div>
				</nav>
				<div className="container">
					{this.props.children}
				</div>
			</div>
		)
	}
}

Main.propTypes = {
	children: React.PropTypes.node,
	location: React.PropTypes.object,
}

function mapStateToProps() {
	return {}
}

export default connect(mapStateToProps/*, actions*/)(Main)