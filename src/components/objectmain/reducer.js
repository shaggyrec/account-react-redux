import {
    FETCH_OBJECT, FETCH_OBJECT_SUCCESS, FETCH_OBJECT_FAILURE, RESET_ACTIVE_OBJECT,
    UPDATE_OBJECT, UPDATE_OBJECT_SUCCESS, UPDATE_OBJECT_FAILURE,
    FETCH_COUNTRIES, FETCH_COUNTRIES_SUCCESS, FETCH_COUNTRIES_FAILURE, FETCH_CITIES, FETCH_CITIES_SUCCESS, FETCH_CITIES_FAILURE,
    GEOCODER, GEOCODER_SUCCESS, GEOCODER_FAILURE,
    UPLOAD_OBJECT_PHOTOS, UPLOAD_OBJECT_PHOTOS_SUCCESS, UPLOAD_OBJECT_PHOTOS_FAILURE,
    DELETE_OBJECT_PHOTO, DELETE_OBJECT_PHOTO_SUCCESS, DELETE_OBJECT_PHOTO_FAILURE,
    FETCH_PAYMENT_TYPES, FETCH_PAYMENT_TYPES_SUCCESS, FETCH_PAYMENT_TYPES_FAILURE
} from './constants';


const INITIAL_STATE = {object:null, error:null, loading: false, countries:[], cities:[],geocoder:null, paymentTypes:[]}

export default function(state = INITIAL_STATE, action) {
    let error;
    switch (action.type) {
        case FETCH_OBJECT:
            return {...state, object:null, loading: true};
        case FETCH_OBJECT_SUCCESS:
            return {object: action.payload, error: null, loading: false}
        case FETCH_OBJECT_FAILURE:
            error = action.payload || {message: action.payload.message};//2nd one is network or server down errors
            return {...state,object: null, error: error, loading: false}
        case RESET_ACTIVE_OBJECT:
            return {...state, object: null, error: null, loading: false}
        case UPDATE_OBJECT:
            return {...state, object: {...state.object}, loading: true}
        case UPDATE_OBJECT_SUCCESS:
            return {...state, object:action.payload, error:null, loading: false}
        case UPDATE_OBJECT_FAILURE:
            error =  action.payload.data ? {message: action.payload.data.message} : action.payload;
            return {...state, object: {...state.object}, error:error, loading: false}
        case UPLOAD_OBJECT_PHOTOS:
            return {...state, object: {...state.object}, loading: true}
        case UPLOAD_OBJECT_PHOTOS_SUCCESS:
            return {...state, object:action.payload, error:null, loading: false}
        case UPLOAD_OBJECT_PHOTOS_FAILURE:
            error = !action.payload.data ? action.payload : {message: action.payload.data.message};
            return {...state, object: {...state.object}, error:error, loading: false}
        case DELETE_OBJECT_PHOTO:
            return {...state, object: {...state.object}, loading: true}
        case DELETE_OBJECT_PHOTO_SUCCESS:
            return {...state, object:action.payload, error:null, loading: false}
        case DELETE_OBJECT_PHOTO_FAILURE:
            error = !action.payload.data ? action.payload : {message: action.payload.data.message};
            return {...state, object: {...state.object}, error:error, loading: false}
        case FETCH_COUNTRIES:
            return {...state.object, error:false, loading: true, countries:[]};
        case FETCH_COUNTRIES_SUCCESS:
            return {...state.object, error: null, loading: false, countries: action.payload}
        case FETCH_COUNTRIES_FAILURE:
            error = action.payload || {message: action.payload.message};//2nd one is network or server down errors
            return {...state.object, error: error, loading: false, countries: []}
        case FETCH_CITIES:
            return {...state, error:false, loading: true, cities:[]};
        case FETCH_CITIES_SUCCESS:
            return {...state, error: null, loading: false, cities: action.payload}
        case FETCH_CITIES_FAILURE:
            error = action.payload || {message: action.payload.message};//2nd one is network or server down errors
            return {...state, error: error, loading: false, cities: []}
        case GEOCODER:
            return {...state, error:false, loading: true, geocoder:null}
        case GEOCODER_SUCCESS:
            return {...state, error: null, loading: false, geocoder: action.payload}
        case GEOCODER_FAILURE:
            error = action.payload || {message: action.payload.message};//2nd one is network or server down errors
            return {...state, error: error, loading: false, geocoder: null}
        default:
            return state
    }
}