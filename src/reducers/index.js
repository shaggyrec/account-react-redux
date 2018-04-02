import {combineReducers} from 'redux'
import user from '../components/user/reducer'
import objectsList from '../components/objectsList/reducer'
import activeObject from '../components/objectmain/reducer'
import rooms from '../components/rooms/reducer'
import help from '../components/help/reducer'
import objectNew from '../components/newObject/reducer'
import invoices from '../components/invoices/reducer'
import feedback from '../components/feedback/reducer'
import howToGetHere from '../components/howToGetHere/reducer'
import booking from '../components/booking/reducer'
import contract from '../components/contract/reducer'
import pageText from '../components/pageText/reducer'
import notifications from '../components/notificationsHistory/reducer'
import subordinate from '../components/subordinate/reducer'

import {routerReducer as routing} from 'react-router-redux'
import {reducer as form} from 'redux-form';
import socket from '../middleware/socketMiddleware/module'

export default combineReducers({
    objectsList,
    activeObject,
    rooms,
    user,
    routing,
    form,
    help,
    objectNew,
    invoices,
    feedback,
    howToGetHere,
    booking,
    contract,
    pageText,
    notifications,
    socket,
    subordinate
})