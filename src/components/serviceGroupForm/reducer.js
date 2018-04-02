import {
    UPDATE_OBJECT,
    UPDATE_OBJECT_SUCCESS,
    UPDATE_OBJECT_FAILURE
} from '../objectmain/constants';

const INITIAL_STATE = {object: null, error: null, loading: false}

export default function (state = INITIAL_STATE, action) {
    let error;
    switch (action.type) {
        case UPDATE_OBJECT:
            return {...state, object: {...state.object}, loading: true}
        case UPDATE_OBJECT_SUCCESS:
            return {...state, object: action.payload, error: null, loading: false}
        case UPDATE_OBJECT_FAILURE:
            error = action.payload.data || {message: action.payload.data.message};
            return {...state, object: {...state.object}, error: error, loading: false}
        default:
            return state
    }
}
