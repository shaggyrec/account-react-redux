import axios from 'axios'
import { FETCH_OBJECTS, FETCH_OBJECTS_SUCCESS, FETCH_OBJECTS_FAILURE, RESET_OBJECTS } from './constants';

const ROOT_URL = 'https://test.edem-v-gosti.ru/lk/api'

export function fetchObjects(tokenFromStorage, search) {
    let request = axios({
        method: 'get',
        url:  `${ROOT_URL}/objects/?token=${tokenFromStorage}&search=${search || ''}`,
    });
    return {
        type: FETCH_OBJECTS,
        payload: request,
        //searchTerm:search
    };
}

export function fetchObjectsSuccess(posts) {
    return {
        type: FETCH_OBJECTS_SUCCESS,
        payload: posts
    };
}

export function fetchObjectsFailure(error) {

    return {
        type: FETCH_OBJECTS_FAILURE,
        payload: error
    };
}