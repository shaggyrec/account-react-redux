import axios from 'axios'
import qs from 'qs'
import {
    FETCH_ORDERS,
    FETCH_ORDERS_FAILURE,
    FETCH_ORDERS_SUCCESS,
    RESET_FILTER,
    FETCH_FORM_RESULTS,
    FETCH_FORM_RESULTS_FAILURE,
    FETCH_FORM_RESULTS_SUCCESS,
    FETCH_ORDER_STATUS_LIST,
    FETCH_ORDER_STATUS_LIST_FAILURE,
    FETCH_ORDER_STATUS_LIST_SUCCESS,
    SET_ORDER_STATUS,
    SET_ORDER_STATUS_SUCCESS,
    SET_ORDER_STATUS_FAILURE,
    CLEAN_ORDER,
    UPDATE_ORDER_STATUS,
    NOTIFY
} from './constants';
const ROOT_URL = 'https://test.edem-v-gosti.ru/lk/api';
export function fetchOrders(id, formValues, tokenFromStorage) {
    const request = axios.post(`${ROOT_URL}/objects/booking.php?objectId=${id}&token=${tokenFromStorage}&action=GET_OBJECT_ORDERS`, qs.stringify(formValues));
    /*const request = axios({
     method: 'post',
     url: `${ROOT_URL}/objects/booking.php?objectId=${id}&token=${tokenFromStorage}&action=GET_OBJECT_ORDERS`,
     data: {
     FILTER: formValues.hasOwnProperty('FILTER') ? JSON.stringify(formValues) : {}
     }
     });*/
    return {
        type: FETCH_ORDERS,
        payload: request
    };
}

export function fetchOrdersSuccess(result) {
    return {
        type: FETCH_ORDERS_SUCCESS,
        payload: result
    };
}

export function fetchOrdersFailure(error) {
    return {
        type: FETCH_ORDERS_FAILURE,
        payload: error
    };
}

export function resetFilter() {
    return {
        type: RESET_FILTER,
        payload: {}
    };
}

export function fetchFormResult(id, formValues, tokenFromStorage) {
    const request = axios.post(`${ROOT_URL}/objects/booking.php?objectId=${id}&token=${tokenFromStorage}&action=GET_OBJECT_FORM_RESULT`, qs.stringify(formValues));
    return {
        type: FETCH_FORM_RESULTS,
        payload: request
    };
}

export function fetchFormResultSuccess(result) {
    return {
        type: FETCH_FORM_RESULTS_SUCCESS,
        payload: result
    };
}

export function fetchFormResultFailure(error) {
    return {
        type: FETCH_FORM_RESULTS_FAILURE,
        payload: error
    };
}

export function fetchOrderStatusList(tokenFromStorage) {
    const request = axios.post(`${ROOT_URL}/objects/booking.php?token=${tokenFromStorage}&action=GET_ORDER_STATUS_LIST`);
    return {
        type: FETCH_ORDER_STATUS_LIST,
        payload: request
    };
}

export function fetchOrderStatusListSuccess(result) {
    return {
        type: FETCH_ORDER_STATUS_LIST_SUCCESS,
        payload: result
    };
}

export function fetchOrderStatusListFailure(error) {
    return {
        type: FETCH_ORDER_STATUS_LIST_FAILURE,
        payload: error
    };
}

export function setOrderStatus(orderId, status, answer, tokenFromStorage) {
    const request = axios.post(`${ROOT_URL}/objects/booking.php?token=${tokenFromStorage}&action=SET_ORDER_STATUS`, qs.stringify({
        ORDER_ID: orderId,
        STATUS: status,
        ANSWER: answer
    }));
    return {
        type: SET_ORDER_STATUS,
        payload: request
    }
}

export function setOrderStatusSuccess(result) {
    return {
        type: SET_ORDER_STATUS_SUCCESS,
        payload: result
    };
}

export function setOrderStatusFailure(error) {
    return {
        type: SET_ORDER_STATUS_FAILURE,
        payload: error
    };
}

export function notify(msg, type, token, link = '') {
    const request = axios.post(`${ROOT_URL}/notifications/index.php?token=${token}&action=NOTIFY`, qs.stringify({
        MESSAGE: msg,
        TYPE: 'message',
        LINK: link
    }));
    return {
        type: NOTIFY,
        payload: request
    }
}

export function cleanOrders() {
    return {
        type: CLEAN_ORDER,
        payload: {}
    };
}

export function updateOrderStatus(objectId, tokenFromStorage) {
    const request = axios.post(`${ROOT_URL}/objects/booking.php?token=${tokenFromStorage}&action=UPDATE_OBJECT_STATUS`, qs.stringify({
        OBJECT_ID: objectId
    }));
    return {
        type: UPDATE_ORDER_STATUS,
        payload: request
    };
}