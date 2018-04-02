import axios from 'axios'
import { FETCH_QUESTIONS, FETCH_QUESTIONS_SUCCESS, FETCH_QUESTIONS_FAILURE, RESET_QUESTIONS } from './constants';

const ROOT_URL = 'https://edem-v-gosti.ru/lk/api'

export function fetchQuestions(tokenFromStorage) {
    //для серевера
    const request = axios({
        method: 'get',
        url:  `${ROOT_URL}/faq/?token=${tokenFromStorage}`,
    });

    return {
        type: FETCH_QUESTIONS,
        payload: request
    };
}

export function fetchQuestionsSuccess(posts) {
    return {
        type: FETCH_QUESTIONS_SUCCESS,
        payload: posts
    };
}

export function fetchQuestionsFailure(error) {

    return {
        type: FETCH_QUESTIONS_FAILURE,
        payload: error
    };
}