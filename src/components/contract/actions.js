import axios from 'axios'
import qs from 'qs'
import { SEND_CONTRACT, SEND_CONTRACT_SUCCESS, SEND_CONTRACT_FAILTURE, RESET_CONTRACT,
FETCH_CONTRACT, FETCH_CONTRACT_SUCCESS, FETCH_CONTRACT_FAILTURE,
FETCH_CONTRACT_DATA, FETCH_CONTRACT_DATA_SUCCESS, FETCH_CONTRACT_DATA_FAILTURE,
FETCH_ORGANIZATIONS_BY_INN, FETCH_ORGANIZATIONS_BY_INN_SUCCESS, FETCH_ORGANIZATIONS_BY_INN_FAILTURE,
SIGN_CONTRACT, SIGN_CONTRACT_SUCCESS, SIGN_CONTRACT_FAILURE, RESET_SUGGESTIONS} from './constants';

const ROOT_URL = 'https://test.edem-v-gosti.ru/lk/api/contract/'

export function FetchContract(id, tokenFromStorage) {
    const request = axios({
        method: 'get',
        url:  `${ROOT_URL}?id=${id}&token=${tokenFromStorage}`,
    })
    return {
        type: FETCH_CONTRACT,
        payload:request
    }
}

export function FetchContractSuccess(response) {
    return {
        type: FETCH_CONTRACT_SUCCESS,
        payload: response
    }
}

export function FetchContractFailure(error) {

    return {
        type: FETCH_CONTRACT_FAILTURE,
        payload: error
    };
}

export function FetchContractData(id, tokenFromStorage) {
    const request = axios({
        method: 'get',
        url:  `${ROOT_URL}?data=${id}&token=${tokenFromStorage}`,
    })
    return {
        type: FETCH_CONTRACT_DATA,
        payload:request
    }
}

export function FetchContractDataSuccess(response) {
    return {
        type: FETCH_CONTRACT_DATA_SUCCESS,
        payload: response
    };
}

export function FetchContractDataFailure(error) {

    return {
        type: FETCH_CONTRACT_DATA_FAILTURE,
        payload: error
    };
}

export function SendContract(id, values, tokenFromStorage) {
    const request = axios({
        method: 'post',
        url:  `${ROOT_URL}?id=${id}&token=${tokenFromStorage}`,
        data: values,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded, multipart/form-data'
        }
    });

    return {
        type: SEND_CONTRACT,
        payload: request
    };
}

export function SendContractSuccess(response) {
    return {
        type: SEND_CONTRACT_SUCCESS,
        payload: response
    };
}

export function SendContractFailure(error) {

    return {
        type: SEND_CONTRACT_FAILTURE,
        payload: error
    };
}

export function FetchOrganizationByInn(inn,tokenFromStorage){
    const request = axios({
        method: 'get',
        url:  `${ROOT_URL}?inn=${inn}&token=${tokenFromStorage}`,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return {
        type: FETCH_ORGANIZATIONS_BY_INN,
        payload: request
    }
}

export function FetchOrganizationByInnSuccess(response){
    return {
        type: FETCH_ORGANIZATIONS_BY_INN_SUCCESS,
        payload: response
    }
}
export function FetchOrganizationByInnFailure(response){
    return {
        type: FETCH_ORGANIZATIONS_BY_INN_FAILTURE,
        payload: response
    }
}
export function ResetSuggestions () {
    return {
        type: RESET_SUGGESTIONS,
    }
}
export function ResetContract() {
    return {
        type: RESET_CONTRACT
    }
}

export function SignContract(id,tokenFromStorage) {
    const request = axios({
        method: 'get',
        url:  `${ROOT_URL}?sign=${id}&token=${tokenFromStorage}`,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return {
        type: SIGN_CONTRACT,
        payload: request
    }
}

export function SignContractSuccess(response) {
    return {
        type: SIGN_CONTRACT_SUCCESS,
        payload: response
    }
}

export function SignContractFailure(error) {
    return {
        type: SIGN_CONTRACT_FAILURE,
        payload: error
    }
}