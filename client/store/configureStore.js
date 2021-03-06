import { createStore, applyMiddleware, compose } from 'redux'
import thunk       from 'redux-thunk'
import rootReducer from '../reducers'

export default function configureStore(preloadedState) {
	if (process.env.NODE_ENV === 'production') {
		return createStore(
			rootReducer, 
			preloadedState,
			applyMiddleware(thunk)
		)
	} else {
		return createStore(
			rootReducer, 
			preloadedState,
			compose(
				applyMiddleware(thunk),
				window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
			)
		)
	}
	
}