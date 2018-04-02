import {CREATE_OBJECT, CREATE_OBJECT_SUCCESS, CREATE_OBJECT_FAILURE} from './constants'

const INITIAL_STATE = {newObj:null, status:null, error:null, loading: false};

export default function(state = INITIAL_STATE, action) {
    let error;
    switch(action.type) {
        case CREATE_OBJECT:
            return {...state, objectId:null, status: 'create', error: null, loading: true}
        case CREATE_OBJECT_SUCCESS://return obj, status = created and make loading = false
            return { ...state, objectId: action.payload, status:'created', error:null, loading: false}; //<-- authenticated
        case CREATE_OBJECT_FAILURE:// return error and make loading = false
            error = action.payload.data || {message: action.payload};//2nd one is network or server down errors
            return { ...state, objectId: null, status:'create', error:error, loading: false};
        default:
            return state;
    }
}