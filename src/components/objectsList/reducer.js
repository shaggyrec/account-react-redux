import { FETCH_OBJECTS, FETCH_OBJECTS_SUCCESS, FETCH_OBJECTS_FAILURE, RESET_OBJECTS,
} from './constants';

const INITIAL_STATE = { objects: [], error:null, loading: false, searchTerm:''};

export default function(state = INITIAL_STATE, action) {
    let error;
    switch (action.type) {

        case FETCH_OBJECTS:
            //console.log(action)
            return {...state, objects: [], error: null, loading: true};
        case FETCH_OBJECTS_SUCCESS:
            return {...state, objects: action.payload.data, error: null, loading: false};
        case FETCH_OBJECTS_FAILURE:
            error = action.payload.response.data || {message: action.payload.message};//2nd one is network or server down errors
            return {...state, objects: [], error: error, loading: false};
        case RESET_OBJECTS:
            return {...state, objects: [], error: null, searchTerm: '', loading: false};
        default:
            return state;
    }
}