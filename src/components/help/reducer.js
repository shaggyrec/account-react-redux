import { FETCH_QUESTIONS, FETCH_QUESTIONS_SUCCESS, FETCH_QUESTIONS_FAILURE, RESET_QUESTIONS,
} from './constants';

const INITIAL_STATE = { questions: [], error:null, loading: false};

export default function(state = INITIAL_STATE, action) {
    let error;
    switch (action.type) {

        case FETCH_QUESTIONS:
            return {...state, questions: [], error: null, loading: true};
        case FETCH_QUESTIONS_SUCCESS:
            return {...state, questions: action.payload.data, error: null, loading: false};
        case FETCH_QUESTIONS_FAILURE:
            error = action.payload.response.data || {message: action.payload.message};//2nd one is network or server down errors
            return {...state, questions: [], error: error, loading: false};
        case RESET_QUESTIONS:
            return {...state, questions: [], error: null, loading: false};
        default:
            return state;
    }
}