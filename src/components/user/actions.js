import axios from 'axios'
import qs from 'qs'

import {SIGNUP_USER, SIGNUP_USER_SUCCESS, SIGNUP_USER_FAILURE, RESET_USER,
    SIGNIN_USER, SIGNIN_USER_SUCCESS, SIGNIN_USER_FAILURE, LOGOUT_USER,
    ME_FROM_TOKEN, ME_FROM_TOKEN_SUCCESS, ME_FROM_TOKEN_FAILURE,RESET_TOKEN,
    VALIDATE_USER_FIELDS, VALIDATE_USER_FIELDS_SUCCESS, VALIDATE_USER_FIELDS_FAILURE, RESET_VALIDATE_USER_FIELDS,
    GET_USER_DATA, GET_USER_DATA_SUCCESS, GET_USER_DATA_FAILURE,
    UPDATE_USER, UPDATE_USER_SUCCESS, UPDATE_USER_FAILURE, CHANGE_PASSWORD, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAILURE
} from './constants'

//const ROOT_URL = '/lk/api';
const ROOT_URL = 'https://test.edem-v-gosti.ru/lk/api'
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

export function meFromToken(tokenFromStorage) {
    //check if the token is still valid, if so, get me from the server

    const request = axios({
        method: 'get',
        url: `${ROOT_URL}/user.php/?act=mefromtoken&token=${tokenFromStorage}`,
        // headers: {
        //     'Authorization': `Bearer ${tokenFromStorage}`
        // }
    });

    return {
        type: ME_FROM_TOKEN,
        payload: request
    };
}

export function meFromTokenSuccess(currentUser) {
    return {
        type: ME_FROM_TOKEN_SUCCESS,
        payload: currentUser
    };
}

export function meFromTokenFailure(error) {
    return {
        type: ME_FROM_TOKEN_FAILURE,
        payload: error
    };
}


export function resetToken() {//used for logout
    return {
        type: RESET_TOKEN
    };
}

export function signUpUser(formValues) {
    const request = axios.post(`${ROOT_URL}/user.php/?act=signup`, qs.stringify(formValues));
    return {
        type: SIGNUP_USER,
        payload: request
    };
}

export function signUpUserSuccess(user) {
    return {
        type: SIGNUP_USER_SUCCESS,
        payload: user
    };
}

export function signUpUserFailure(error) {
    return {
        type: SIGNUP_USER_FAILURE,
        payload: error
    };
}


export function resetUser() {
    return {
        type: RESET_USER,
    };
}

export function signInUser(formValues) {
    const request = axios.post(`${ROOT_URL}/user.php?act=signin`, qs.stringify(formValues));

    return {
        type: SIGNIN_USER,
        payload: request
    };
}

export function signInUserSuccess(user) {
    return {
        type: SIGNIN_USER_SUCCESS,
        payload: user
    };
}

export function signInUserFailure(error) {
    return {
        type: SIGNIN_USER_FAILURE,
        payload: error
    };
}

export function logoutUser() {
    let token = localStorage.getItem('jwtToken');
    const request = axios.post(`${ROOT_URL}/user.php?act=logout&token=${token}`);
    localStorage.removeItem('jwtToken');
    return {
        type: LOGOUT_USER
    };
}
export function validateUserFields(values) {
    //note: we cant have /users/validateFields because it'll match /users/:id path!
    const request = axios.post(`${ROOT_URL}/user.php?validate=fields`, qs.stringify(values));
    return {
        type: VALIDATE_USER_FIELDS,
        payload: request
    };
}

export function validateUserFieldsSuccess() {
    return {
        type: VALIDATE_USER_FIELDS_SUCCESS
    };
}

export function validateUserFieldsFailure(error) {
    return {
        type: VALIDATE_USER_FIELDS_FAILURE,
        payload: error
    };
}

export function resetValidateUserFields() {
    return {
        type: RESET_VALIDATE_USER_FIELDS
    }
}

export function getUserData(tokenFromStorage) {
    const request = axios({
        method: 'get',
        url: `${ROOT_URL}/user.php/?token=${tokenFromStorage}`,
    })
    return {
        type: GET_USER_DATA,
        payload: request
    }
}

export function getUserDataSuccess(user) {
    return {
        type: GET_USER_DATA_SUCCESS,
        payload: user
    }
}

export function getUserDataFailure(error) {
    return {
        type: GET_USER_DATA_FAILURE,
        payload: error
    }
}
export function updateUser (values, token) {
    const request = axios.put(`${ROOT_URL}/user.php?token=${token}`, values);
    return {
        type: UPDATE_USER,
        payload: request
    };
}

export function updateUserSuccess (user) {
    return {
        type: UPDATE_USER_SUCCESS,
        payload: user
    }
}

export function updateUserFailure (error) {
    return {
        type: UPDATE_USER_FAILURE,
        payload: error
    }
}
export function changePassword(values,token) {
    const request = axios.put(`${ROOT_URL}/user.php?changePassword=1&token=${token}`, values);
    return {
        type: CHANGE_PASSWORD,
        payload: request
    }
}
export function changePasswordSuccess (user) {
    return {
        type: CHANGE_PASSWORD_SUCCESS,
        payload: user
    }
}

export function changePasswordFailure (error) {
    return {
        type: CHANGE_PASSWORD_FAILURE,
        payload: error
    }
}