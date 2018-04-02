import {SIGNUP_USER, SIGNUP_USER_SUCCESS, SIGNUP_USER_FAILURE, RESET_USER,SIGNIN_USER, SIGNIN_USER_SUCCESS, SIGNIN_USER_FAILURE, LOGOUT_USER,
ME_FROM_TOKEN, ME_FROM_TOKEN_SUCCESS,ME_FROM_TOKEN_FAILURE, RESET_TOKEN,
VALIDATE_USER_FIELDS, VALIDATE_USER_FIELDS_SUCCESS, VALIDATE_USER_FIELDS_FAILURE, RESET_VALIDATE_USER_FIELDS,
GET_USER_DATA, GET_USER_DATA_SUCCESS, GET_USER_DATA_FAILURE,UPDATE_USER, UPDATE_USER_SUCCESS, UPDATE_USER_FAILURE,
CHANGE_PASSWORD, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAILURE, VALIDATE_SUBORDINATE_FIELDS, VALIDATE_SUBORDINATE_FIELDS_SUCCESS,VALIDATE_SUBORDINATE_FIELDS_FAILURE, RESET_VALIDATE_SUBORDINATE_FIELDS
} from './constants'

const INITIAL_STATE = {user: null, status:null, error:null, loading: false, data:null};

export default function(state = INITIAL_STATE, action) {
    let error;
    switch(action.type) {
        case ME_FROM_TOKEN:// loading currentUser("me") from jwttoken in local/session storage storage,
            return { ...state, user: null, status:'storage', error:null, loading: true};
        case ME_FROM_TOKEN_SUCCESS://return user, status = authenticated and make loading = false
            return { ...state, user: action.payload.data.user, status:'authenticated', error:null, loading: false}; //<-- authenticated
        case ME_FROM_TOKEN_FAILURE:// return error and make loading = false
            error = action.payload.response && action.payload.response.data || {message: action.payload.data};//2nd one is network or server down errors
            return { ...state, user: null, status:'storage', error:error, loading: false};
        case RESET_TOKEN:// remove token from storage make loading = false
            return { ...state, user: null, status:'storage', error:null, loading: false};
        case SIGNUP_USER:// sign up user, set loading = true and status = signup
            return { ...state, user: null, status:'signup', error:null, loading: true};
        case SIGNUP_USER_SUCCESS://return user, status = authenticated and make loading = false
            return { ...state, user: action.payload, status:'signuped', error:null, loading: false}; //<-- authenticated
        case SIGNUP_USER_FAILURE:// return error and make loading = false
            error = action.payload.data || {message: action.payload};//2nd one is network or server down errors
            return { ...state, user: null, status:'signup', error:error, loading: false};
        case SIGNIN_USER:// sign in user,  set loading = true and status = signin
            return { ...state, user: null, status:'signin', error:null, loading: true};
        case SIGNIN_USER_SUCCESS://return authenticated user,  make loading = false and status = authenticate
            return { ...state, user: action.payload.user, status:'authenticated', error:null, loading: false}; //<-- authenticated
        case SIGNIN_USER_FAILURE:// return error and make loading = false
            error = action.payload.response && action.payload.response.data || {message: action.payload.message};//2nd one is network or server down errors
            return { ...state, user: null, status:'signin', error:error, loading: false};
        case LOGOUT_USER:
            return {...state, user:null, status:'logout', error:null, loading: false};
        case RESET_USER:// reset authenticated user to initial state
            return { ...state, user: null, status:null, error:null, loading: false}

        case VALIDATE_USER_FIELDS://sign up or sign in form fields
            return { ...state, error:null, loading: true};
        case VALIDATE_USER_FIELDS_SUCCESS:// same as RESET_USER_FIELDS
            return { ...state, error:null, loading: false};
        case VALIDATE_USER_FIELDS_FAILURE:
            error = action.payload.data ? action.payload.data : {message: action.payload.message}
            return { ...state, error:error, loading: false};
        case RESET_VALIDATE_USER_FIELDS:
            return { ...state, error:null, loading: false};
        case GET_USER_DATA:
            return {...state, error:null, loading: true, data: null}
        case GET_USER_DATA_SUCCESS:
            return {...state, error:null, loading: false, data: action.payload}
        case GET_USER_DATA_FAILURE:
            error = action.payload.data ? action.payload.data : {message: action.payload.message}
            return {...state, error: error, loading: false, data: null}
        case UPDATE_USER:
            return {...state, error:null, loading: true}
        case UPDATE_USER_SUCCESS:
            return {...state,data:action.payload, error:null, loading: false}
        case UPDATE_USER_FAILURE:
            error = action.payload.data ? action.payload.data : {message: action.payload.statusText}
            return {...state, error:error, loading: false}
        case CHANGE_PASSWORD:
            return {...state, error:null, loading: true}
        case CHANGE_PASSWORD_SUCCESS:
            return {...state, error:{message:action.payload}, loading: false}
        case CHANGE_PASSWORD_FAILURE:
            error = action.payload.data ? action.payload.data : {message: action.payload.statusText}
            return {...state, error:error, loading: false}
        default:
            return state;
    }
}