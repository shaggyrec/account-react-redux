import axios from 'axios'
import qs from 'qs'
import {
    FETCH_SUBORDINATE, FETCH_SUBORDINATE_SUCCESS, FETCH_SUBORDINATE_FAILURE,
    UPDATE_SUBORDINATE, UPDATE_SUBORDINATE_SUCCESS, UPDATE_SUBORDINATE_FAILURE, VALIDATE_SUBORDINATE_FIELDS, VALIDATE_SUBORDINATE_FIELDS_SUCCESS,VALIDATE_SUBORDINATE_FIELDS_FAILURE, RESET_VALIDATE_SUBORDINATE_FIELDS
} from './constants'

const ROOT_URL = 'https://test.edem-v-gosti.ru/lk/api/subordinate/'
export function fetchSubordinate(token) {
    const request = axios.get(`${ROOT_URL}?token=${token}`);
    return {
        type: FETCH_SUBORDINATE,
        payload: request
    }
}
export function fetchSubordinateSuccess(subordinate) {
    return {
        type: FETCH_SUBORDINATE_SUCCESS,
        payload: subordinate
    }
}
export function fetchSubordinateFailure(error) {
    return {
        type: FETCH_SUBORDINATE_FAILURE,
        payload: error
    }
}
export function updateSubordinate (values, token) {
    const request = axios.post(`${ROOT_URL}?token=${token}`,  qs.stringify(values));
    return {
        type: UPDATE_SUBORDINATE,
        payload: request
    };
}

export function updateSubordinateSuccess (user) {
    return {
        type: UPDATE_SUBORDINATE_SUCCESS,
        payload: user
    }
}

export function updateSubordinateFailure (error) {
    return {
        type: UPDATE_SUBORDINATE_FAILURE,
        payload: error
    }
}
export function validateSubordinateFields(values, token) {
    const request = axios.post(`${ROOT_URL}?&validate=subordinate&token=${token}`, qs.stringify(values));
    return {
        type: VALIDATE_SUBORDINATE_FIELDS,
        payload: request
    };
}

export function validateSubordinateFieldsSuccess() {
    return {
        type: VALIDATE_SUBORDINATE_FIELDS_SUCCESS
    };
}

export function validateSubordinateFieldsFailure(error) {
    return {
        type: VALIDATE_SUBORDINATE_FIELDS_FAILURE,
        payload: error
    };
}

export function resetSubordinateUserFields() {
    return {
        type: RESET_VALIDATE_SUBORDINATE_FIELDS
    }
}
