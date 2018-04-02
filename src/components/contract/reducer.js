import { SEND_CONTRACT, SEND_CONTRACT_SUCCESS, SEND_CONTRACT_FAILTURE, FETCH_ORGANIZATIONS_BY_INN, FETCH_ORGANIZATIONS_BY_INN_SUCCESS, FETCH_ORGANIZATIONS_BY_INN_FAILTURE, RESET_CONTRACT,FETCH_CONTRACT, FETCH_CONTRACT_SUCCESS, FETCH_CONTRACT_FAILTURE,FETCH_CONTRACT_DATA,FETCH_CONTRACT_DATA_SUCCESS,FETCH_CONTRACT_DATA_FAILTURE,
    SIGN_CONTRACT, SIGN_CONTRACT_SUCCESS, SIGN_CONTRACT_FAILURE, RESET_SUGGESTIONS} from './constants'

const INITIAL_STATE = {
        contract:{contract:null, contractData:null,message:null, error:null, loading: false},
        innSearchResults:{suggestions:[],error:null,loading:false}
    }

export default function(state = INITIAL_STATE, action) {
    let error;
    switch (action.type) {
        case SEND_CONTRACT:
            return {...state ,contract:{message:null, error: null, loading: true}}
        case SEND_CONTRACT_SUCCESS:
            return {...state, contract:{message:action.payload, error: null, loading: false}}
        case SEND_CONTRACT_FAILTURE:
            error = action.payload.response ? action.payload.response.data : action.payload
            return {...state,contract:{message:null, error: error, loading: false}}
        case FETCH_CONTRACT:
            return {...state, contract:{contract:null, contractData:null, message:null, loading: true}}
        case FETCH_CONTRACT_SUCCESS:
            return {...state, contract:{contract: action.payload, contractData:null, message:null, error: null, loading: false}}
        case FETCH_CONTRACT_FAILTURE:
            error = action.payload || {message: action.payload.message};//2nd one is network or server down errors
            return {...state, contract:{contract:null, contractData: null, message:null, error: error, loading: false}}
        case FETCH_CONTRACT_DATA:
            return {...state, contract:{contractData:null, message:null, loading: true}}
        case FETCH_CONTRACT_DATA_SUCCESS:
            return {...state, contract:{contractData: action.payload, message:null, error: null, loading: false}}
        case FETCH_CONTRACT_DATA_FAILTURE:
            error = action.payload || {message: action.payload.message};//2nd one is network or server down errors
            return {...state, contract:{contract:null,contractData: null, message:null, error: error, loading: false}}
        case RESET_SUGGESTIONS:
            return {...state ,innSearchResults:{suggestions:[],error:null,loading:true}}
        case RESET_CONTRACT:
            return {...state, contract:{message:null, error: null, loading: false}}
        case SIGN_CONTRACT:
            return {...state, contract:{contract:state.contract.contract, message:null, error: null, loading: true}}
        case SIGN_CONTRACT_SUCCESS:
            return {...state, contract:{contract:state.contract.contract, message:action.payload.data || action.payload, error: null, loading: false}}
        case SIGN_CONTRACT_FAILURE:
            error = action.payload || {message: action.payload.message};//2nd one is network or server down errors
            return {...state, contract:{contract:null,contractData: null, message:null, error: error, loading: false}}
        case FETCH_ORGANIZATIONS_BY_INN:
            return {...state ,innSearchResults:{suggestions:[],error:null,loading:true}}
        case FETCH_ORGANIZATIONS_BY_INN_SUCCESS:
            return {...state ,innSearchResults:{suggestions:action.payload.data, error:null,loading:false}}
        case FETCH_ORGANIZATIONS_BY_INN_FAILTURE:
            error = action.payload.response ? action.payload.response.data : action.payload
            return {...state ,innSearchResults:{suggestions:state.innSearchResults.suggestions,error:error,loading:false}}
        default:
            return state;
    }
}