import { SEND_MESSAGE, SEND_MESSAGE_SUCCESS,SEND_MESSAGE_FAILURE, RESET_MESSAGE } from './constants';

const INITIAL_STATE = { message:null, error:null, loading: false};

export default function(state = INITIAL_STATE, action) {
    let error;
    switch (action.type) {

        case SEND_MESSAGE:
            return {...state ,message:null, error: null, loading: true};
        case SEND_MESSAGE_SUCCESS:
            return {...state, message:action.payload.data, error: null, loading: false};
        case SEND_MESSAGE_FAILURE:
            error = action.payload.response ? action.payload.response.data : action.payload
            return {...state, message:null, error: error, loading: false};
        case  RESET_MESSAGE:
            return INITIAL_STATE
        default:
            return state;
    }
}