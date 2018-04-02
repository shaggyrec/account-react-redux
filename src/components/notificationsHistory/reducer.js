import {FETCH_NOTIFICATIONS, FETCH_NOTIFICATIONS_SUCCESS, FETCH_NOTIFICATIONS_FAILURE} from './constants'

const INITIAL_STATE = {notifications: null, error: null, loading: false};

export default function (state = INITIAL_STATE, action) {
    let error;
    switch (action.type) {
        case FETCH_NOTIFICATIONS:
            return {...state, notifications: null, error: null, loading: true}
        case FETCH_NOTIFICATIONS_SUCCESS://return obj, status = created and make loading = false
            return {...state, notifications: action.payload, error: null, loading: false}; //<-- authenticated
        case FETCH_NOTIFICATIONS_FAILURE:// return error and make loading = false
            error = action.payload.data || {message: action.payload};//2nd one is network or server down errors
            return {...state, notifications: null, error: error, loading: false};
        default:
            return state;
    }
}