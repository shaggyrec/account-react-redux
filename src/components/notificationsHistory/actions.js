import axios from 'axios'

import {FETCH_NOTIFICATIONS, FETCH_NOTIFICATIONS_FAILURE, FETCH_NOTIFICATIONS_SUCCESS} from './constants'
//const ROOT_URL = '/lk/api';
const ROOT_URL = 'https://test.edem-v-gosti.ru/lk/api'

export function fetchNotifications(token) {
    const request = axios.post(`${ROOT_URL}/notifications/?token=${token}&action=GET_HISTORY`);
    return {
        type: FETCH_NOTIFICATIONS,
        payload: request
    }
}

export function fetchNotificationsFailure(error) {

    return {
        type: FETCH_NOTIFICATIONS_FAILURE,
        payload: error
    };
}

export function fetchNotificationsSuccess(object) {
    return {
        type: FETCH_NOTIFICATIONS_SUCCESS,
        payload: object
    };
}