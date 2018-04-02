import {
    FETCH_ORDERS_SUCCESS,
    FETCH_ORDERS_FAILURE,
    FETCH_ORDERS,
    FETCH_FORM_RESULTS,
    FETCH_FORM_RESULTS_SUCCESS,
    FETCH_FORM_RESULTS_FAILURE,
    FETCH_ORDER_STATUS_LIST,
    FETCH_ORDER_STATUS_LIST_SUCCESS,
    FETCH_ORDER_STATUS_LIST_FAILURE,
    SET_ORDER_STATUS,
    SET_ORDER_STATUS_FAILURE,
    SET_ORDER_STATUS_SUCCESS,
    CLEAN_ORDER,
    UPDATE_ORDER_STATUS
} from './constants';
const INITIAL_STATE = {error: null, loading: false, orders: null};

export default function (state = INITIAL_STATE, action) {
    let error;
    switch (action.type) {
        case FETCH_ORDERS:
        case FETCH_FORM_RESULTS:
            return {...state, orders: null, loading: true};
        case FETCH_ORDERS_SUCCESS:
        case FETCH_FORM_RESULTS_SUCCESS:
            return {...state, orders: action.payload, error: null, loading: false}
        case FETCH_ORDERS_FAILURE:
        case FETCH_FORM_RESULTS_FAILURE:
            error = action.payload || {message: 'error'};//2nd one is network or server down errors
            return {...state, orders: null, error: error, loading: false}
        case FETCH_ORDER_STATUS_LIST:
            return {...state, statusList: null, loading: true};
        case FETCH_ORDER_STATUS_LIST_SUCCESS:
            return {...state, statusList: action.payload, error: null, loading: false}
        case FETCH_ORDER_STATUS_LIST_FAILURE:
            error = action.payload || {message: 'error'};//2nd one is network or server down errors
            return {...state, statusList: null, error: error, loading: false}
        case SET_ORDER_STATUS:
            return {...state, loading: true};
        case SET_ORDER_STATUS_SUCCESS:
            return {...state, error: null, loading: false}
        case SET_ORDER_STATUS_FAILURE:
            error = action.payload || {message: 'error'};//2nd one is network or server down errors
            return {...state, error: error, loading: false}
        case CLEAN_ORDER:
            return {...state, orders: null}
        case UPDATE_ORDER_STATUS:
        default:
            return state
    }
}