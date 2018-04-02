import axios from 'axios'
import qs from 'qs'
import {
    SEND_MESSAGE,
    SEND_MESSAGE_SUCCESS,
    SEND_MESSAGE_FAILURE,
    SEND_REQUEST,
    SEND_REQUEST_SUCCESS,
    SEND_REQUEST_FAILURE,
    RESET_MESSAGE
} from './constants';

const ROOT_URL = 'https://test.edem-v-gosti.ru/lk/api'

export function SendMessage(values, tokenFromStorage) {
    //для серевера
    const request = axios({
        method: 'post',
        url: `${ROOT_URL}/feedback/?token=${tokenFromStorage}`,
        data: values,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded, multipart/form-data'
        }
    });

    return {
        type: SEND_MESSAGE,
        payload: request
    };
}

export function SendMessageSuccess(posts) {
    return {
        type: SEND_MESSAGE_SUCCESS,
        payload: posts
    };
}

export function SendMessageFailure(error) {

    return {
        type: SEND_MESSAGE_FAILURE,
        payload: error
    };
}

export function SendRequest(tokenFromStorage) {
    //для серевера
    const request = axios.post(
        `${ROOT_URL}/feedback/?token=${tokenFromStorage}`,
        qs.stringify({action: 'CREATE_REQUEST'})
    );

    return {
        type: SEND_REQUEST,
        payload: request
    };
}
export function ResetMessage() {
    return {
        type:RESET_MESSAGE
    }
}