import axios from 'axios'
import {
    FETCH_OBJECT, FETCH_OBJECT_SUCCESS, FETCH_OBJECT_FAILURE, RESET_ACTIVE_OBJECT,
    UPDATE_OBJECT, UPDATE_OBJECT_SUCCESS, UPDATE_OBJECT_FAILURE,
    FETCH_COUNTRIES, FETCH_COUNTRIES_SUCCESS, FETCH_COUNTRIES_FAILURE, FETCH_CITIES, FETCH_CITIES_SUCCESS, FETCH_CITIES_FAILURE,
    GEOCODER,GEOCODER_SUCCESS,GEOCODER_FAILURE, UPLOAD_OBJECT_PHOTOS, UPLOAD_OBJECT_PHOTOS_SUCCESS, UPLOAD_OBJECT_PHOTOS_FAILURE,
    DELETE_OBJECT_PHOTO,DELETE_OBJECT_PHOTO_SUCCESS,DELETE_OBJECT_PHOTO_FAILURE,
    FETCH_PAYMENT_TYPES, FETCH_PAYMENT_TYPES_SUCCESS, FETCH_PAYMENT_TYPES_FAILURE
} from './constants';

const ROOT_URL = 'https://test.edem-v-gosti.ru/lk/api'
export function fetchObject(id, tokenFromStorage) {
    const request = axios.get(`${ROOT_URL}/objects/?id=${id}&token=${tokenFromStorage}`)
    return {
        type: FETCH_OBJECT,
        payload: request
    };
}


export function fetchObjectSuccess(activePost) {
    return {
        type: FETCH_OBJECT_SUCCESS,
        payload: activePost
    };
}

export function fetchObjectFailure(error) {
    return {
        type: FETCH_OBJECT_FAILURE,
        payload: error
    };
}

export function resetActiveObject() {
    return {
        type: RESET_ACTIVE_OBJECT
    }
}

export function updateObject(id, props, tokenFromStorage) {

    const request = axios({
        method: 'put',
        data: props,
        url: `${ROOT_URL}/objects/?id=${id}&token=${tokenFromStorage}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded, multipart/form-data'
        }
    });

    return {
        type: UPDATE_OBJECT,
        payload: request
    };
}

export function updateObjectSuccess(activeObject) {
    return {
        type: UPDATE_OBJECT_SUCCESS,
        payload: activeObject
    };
}

export function updateObjectFailure(error) {
    return {
        type: UPDATE_OBJECT_FAILURE,
        payload: error
    };
}

export function uploadObjectPhotos(id, props, tokenFromStorage) {

    const request = axios({
        method: 'post',
        data: props,
        url: `${ROOT_URL}/objects/?photos=${id}&token=${tokenFromStorage}`,
        // headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded, multipart/form-data'
        // }
    });

    return {
        type: UPLOAD_OBJECT_PHOTOS,
        payload: request
    };
}

export function uploadObjectPhotosSuccess(activeObject) {
    return {
        type: UPLOAD_OBJECT_PHOTOS_SUCCESS,
        payload: activeObject
    };
}

export function uploadObjectPhotosFailure(error) {
    return {
        type: UPLOAD_OBJECT_PHOTOS_FAILURE,
        payload: error
    };
}


export function deleteObjectPhoto(id, photoId, tokenFromStorage) {

    const request = axios({
        method: 'delete',
        // data: props,
        url: `${ROOT_URL}/objects/?photos=${id}&photo=${photoId}&token=${tokenFromStorage}`,
        // headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded, multipart/form-data'
        // }
    });

    return {
        type: DELETE_OBJECT_PHOTO,
        payload: request
    };
}

export function deleteObjectPhotoSuccess(activeObject) {
    return {
        type: DELETE_OBJECT_PHOTO_SUCCESS,
        payload: activeObject
    };
}

export function deleteObjectPhotoFailure(error) {
    return {
        type: DELETE_OBJECT_PHOTO_FAILURE,
        payload: error
    };
}
export function fetchCountries() {
    const request = axios.get(`${ROOT_URL}/objects/?act=countries`)
    return {
        type: FETCH_COUNTRIES,
        payload: request
    };
}


export function fetchCountriesSuccess(countries) {
    return {
        type: FETCH_COUNTRIES_SUCCESS,
        payload: countries
    };
}


export function fetchCountriesFailure(error) {
    return {
        type: FETCH_COUNTRIES_FAILURE,
        payload: error
    };
}

export function fetchCities(countryId) {
    const request = axios.get(`${ROOT_URL}/objects/?act=cities&country=${countryId}`)
    return {
        type: FETCH_CITIES,
        payload: request
    };
}


export function fetchCitiesSuccess(cities) {
    return {
        type: FETCH_CITIES_SUCCESS,
        payload: cities
    };
}

export function fetchCitiesFailure(error) {
    return {
        type: FETCH_CITIES_FAILURE,
        payload: error
    };
}

export function geocoder(geocode) {
    const request = axios.get(`${ROOT_URL}/map/?geocode=${geocode}`)
    return {
        type: GEOCODER,
        payload: request
    };
}

export function geocoderSuccess(response) {
    return {
        type: GEOCODER_SUCCESS,
        payload: response
    };
}

export function geocoderFailure(error) {
    return {
        type: GEOCODER_FAILURE,
        payload: error
    };
}
export function fetchPaymentTypes(iblock, token) {
    const request = axios.get(`${ROOT_URL}/objects/?payments=${iblock}&token=${token}`)
    return {
        type: FETCH_PAYMENT_TYPES,
        payload: request
    };
}


export function fetchPaymentTypesSuccess(types) {
    return {
        type: FETCH_PAYMENT_TYPES_SUCCESS,
        payload: types
    };
}

export function fetchPaymentTypesFailure(error) {
    return {
        type: FETCH_PAYMENT_TYPES_FAILURE,
        payload: error
    };
}