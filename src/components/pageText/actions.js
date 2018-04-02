import axios from 'axios'
import { FETCH_PAGE_TEXT, FETCH_PAGE_TEXT_SUCCESS, FETCH_PAGE_TEXT_FAILURE, RESET_PAGE_TEXT } from './constants';

const ROOT_URL = 'https://test.edem-v-gosti.ru/lk/api/getPageText/'

export function fetchPageText(page,tokenFromStorage) {
    //для серевера
    const request = axios({
        method: 'get',
        url:  `${ROOT_URL}?page=${page}&token=${tokenFromStorage}`,
    });

    return {
        type: FETCH_PAGE_TEXT,
        payload: request
    };
}

export function fetchPageTextSuccess(text) {
    return {
        type: FETCH_PAGE_TEXT_SUCCESS,
        payload: text
    };
}

export function fetchPageTextFailure(error) {

    return {
        type: FETCH_PAGE_TEXT_FAILURE,
        payload: error
    };
}
export  function  resetPageText() {
    return {
        type: RESET_PAGE_TEXT
    }
}