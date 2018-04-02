import axios from 'axios'
import {
    UPDATE_OBJECT,
    UPDATE_OBJECT_SUCCESS,
    UPDATE_OBJECT_FAILURE
} from '../objectmain/constants';

const ROOT_URL = 'https://test.edem-v-gosti.ru/lk/api';

export function updateObjectPropsGroup(id, groupName, props, tokenFromStorage) {
    const request = axios({
        method: 'put',
        data: props,
        url: `${ROOT_URL}/objects/index.php?id=${id}&token=${tokenFromStorage}&action=UPDATE_PROPS_GROUP`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded, multipart/form-data'
        }
    });

    return {
        type: UPDATE_OBJECT,
        payload: request
    };
}

export function updateObjectPropsGroupSuccess(activeObject) {
    return {
        type: UPDATE_OBJECT_SUCCESS,
        payload: activeObject
    };
}

export function updateObjectPropsGroupFailure(error) {
    return {
        type: UPDATE_OBJECT_FAILURE,
        payload: error
    };
}