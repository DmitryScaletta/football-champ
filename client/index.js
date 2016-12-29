import React                from 'react'
import { render }           from 'react-dom'
import { AppContainer }     from 'react-hot-loader'
import MuiThemeProvider     from 'material-ui/styles/MuiThemeProvider'
import App                  from './containers/App'
import configureStore       from './store/configureStore'
import injectTapEventPlugin from 'react-tap-event-plugin'

injectTapEventPlugin()

const store = configureStore()

render(
	<AppContainer>
		<MuiThemeProvider>
			<App store={store} />
		</MuiThemeProvider>
	</AppContainer>,
	document.getElementById('root')
)

if (module.hot) {
	module.hot.accept('./containers/App', () => {
		const NextApp = require('./containers/App').default
		render(
			<AppContainer>
				<MuiThemeProvider>
					<NextApp store={store} />
				</MuiThemeProvider>
			</AppContainer>,
			document.getElementById('root')
		)
	})
}