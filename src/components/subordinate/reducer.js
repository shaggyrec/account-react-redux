import {
    FETCH_SUBORDINATE, FETCH_SUBORDINATE_SUCCESS, FETCH_SUBORDINATE_FAILURE,
    UPDATE_SUBORDINATE, UPDATE_SUBORDINATE_SUCCESS, UPDATE_SUBORDINATE_FAILURE,
    VALIDATE_SUBORDINATE_FIELDS, VALIDATE_SUBORDINATE_FIELDS_SUCCESS,VALIDATE_SUBORDINATE_FIELDS_FAILURE, RESET_VALIDATE_SUBORDINATE_FIELDS
} from './constants'

const INITIAL_STATE = {subordinates: null, error:null, loading: false}

export default function(state = INITIAL_STATE, action) {
    let error;
    switch (action.type) {
        case FETCH_SUBORDINATE:
            return {...state, subordinates: null, error: null, loading: true};
        case FETCH_SUBORDINATE_SUCCESS:
            return {...state, subordinates: action.payload, error: null, loading:false};
        case FETCH_SUBORDINATE_FAILURE:
            error = {message : action.payload, loading:false}
            return {...state, error: error, loading: false};
        case UPDATE_SUBORDINATE:
            return {...state, error:null, loading: true}
        case UPDATE_SUBORDINATE_SUCCESS:
            return {...state,subordinates: action.payload, error:null, loading: null}
        case UPDATE_SUBORDINATE_FAILURE:
            error = {message : action.payload, loading:false}
            return {...state, error:error, loading: null}
        case VALIDATE_SUBORDINATE_FIELDS:
            return {...state, error: null, loading: true};
        case VALIDATE_SUBORDINATE_FIELDS_SUCCESS:
            return {...state,  error: null, loading: false};
        case VALIDATE_SUBORDINATE_FIELDS_FAILURE:
            error = action.payload.data || action.payload
            return {...state, error: error, loading: false};
        case RESET_VALIDATE_SUBORDINATE_FIELDS:
            return {...state, error: null, loading: false};
        default:
            return state;
    }
}