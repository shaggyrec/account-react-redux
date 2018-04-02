import React from 'react';
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore  from './store/configureStore'
import { BrowserRouter as Router } from 'react-router-dom'
import { syncHistoryWithStore } from 'react-router-redux'
import { createBrowserHistory } from 'history'
import './st/bootstrap.min.css'
import './st/mdb.min.css'
import './st/st.css'
import App from './components/root/container';
import registerServiceWorker from './registerServiceWorker';


const store = configureStore()
const history = syncHistoryWithStore(createBrowserHistory(), store)

render(
    <Provider store={store}>
        <div className='app'>
            <Router history={history}>
                <App />
            </Router>
        </div>
    </Provider>,
    document.getElementById('root')
)

registerServiceWorker()
