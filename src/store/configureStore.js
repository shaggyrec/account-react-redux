import { createStore, applyMiddleware } from 'redux'
import rootReducer from '../reducers'
// import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import promise from 'redux-promise'
import createSocketMiddleware from '../middleware/socketMiddleware';

export default function configureStore(initialState) {
    const store = createStore(rootReducer, initialState, applyMiddleware(thunk,promise,createSocketMiddleware()))
    if(module.hot){
        module.hot.accept('../reducers',()=>{
            const nextRootReducer = require('../reducers')
            store.replaceReducer(nextRootReducer)
        })
    }
    return store
}