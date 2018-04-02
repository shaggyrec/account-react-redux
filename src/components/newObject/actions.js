import axios from 'axios'
import qs from 'qs'
import {SubmissionError} from 'redux-form'

import {CREATE_OBJECT, CREATE_OBJECT_SUCCESS, CREATE_OBJECT_FAILURE} from './constants'

//const ROOT_URL = '/lk/api';
const ROOT_URL = 'https://test.edem-v-gosti.ru/lk/api'
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

export function createObject(formValues, token) {
    const request = axios.post(`${ROOT_URL}/objects/?act=createObject&token=${token}`, qs.stringify(formValues));
    return {
        type: CREATE_OBJECT,
        payload: request
    }
}

export function createObjectFailure(error) {

    return {
        type: CREATE_OBJECT_FAILURE,
        payload: error
    };
}

export function createObjectSuccess(object) {
    return {
        type: CREATE_OBJECT_SUCCESS,
        payload: object
    };
}

export function validateAndCreateObject(formValues, dispatch) {
    let token = localStorage.getItem('jwtToken');
    if (!token || token === '') {
        let data = { data: { message: 'Please Sign In' } };
        dispatch(createObjectFailure(data));
        throw new SubmissionError(data);
    }
    return dispatch(createObject(formValues, token)).then((result) => {
        if (result.payload.response && result.payload.response.status !== 200) {
            dispatch(createObjectFailure(result.payload.response.data));
            throw new SubmissionError(result.payload.response.data);
        }
        dispatch(createObjectSuccess(result.payload.data));
    })
}
