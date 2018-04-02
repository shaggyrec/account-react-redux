import { FETCH_PAGE_TEXT, FETCH_PAGE_TEXT_SUCCESS, FETCH_PAGE_TEXT_FAILURE, RESET_PAGE_TEXT,
} from './constants';

const INITIAL_STATE = { pageText: null, error:null, loading: false};

export default function(state = INITIAL_STATE, action) {
    let error;
    switch (action.type) {

        case FETCH_PAGE_TEXT:
            return {...state, pageText: null, error: null, loading: true};
        case FETCH_PAGE_TEXT_SUCCESS:
            return {...state, pageText: action.payload.data, error: null, loading: false};
        case FETCH_PAGE_TEXT_FAILURE:
            error = action.payload.response.data || {message: action.payload.message};//2nd one is network or server down errors
            return {...state, pageText: null, error: error, loading: false};
        case RESET_PAGE_TEXT:
            return {...state, pageText: null, error: null, loading: false};
        default:
            return state;
    }
}