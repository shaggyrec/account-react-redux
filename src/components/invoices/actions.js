import axios from 'axios'
import { FETCH_INVOICES, FETCH_INVOICES_SUCCESS, FETCH_INVOICES_FAILURE, RESET_INVOICES,
    FETCH_INVOICE_LINK, FETCH_INVOICE_LINK_SUCCESS, FETCH_INVOICE_LINK_FAILURE} from './constants';

const ROOT_URL = 'https://test.edem-v-gosti.ru/lk/api'

export function fetchInvoices(tokenFromStorage, search) {
    let request = axios({
        method: 'get',
        url:  `${ROOT_URL}/invoices/?token=${tokenFromStorage}`,
    });
    return {
        type: FETCH_INVOICES,
        payload: request,
    };
}

export function fetchInvoicesSuccess(posts) {
    return {
        type: FETCH_INVOICES_SUCCESS,
        payload: posts
    };
}

export function fetchInvoicesFailure(error) {

    return {
        type: FETCH_INVOICES_FAILURE,
        payload: error
    };
}

export function fetchInvoiceLink(id,token) {
    let request = axios({
        method: 'get',
        url:  `${ROOT_URL}/invoices/?getLink=${id}&token=${token}`,
    })
    return {
        type: FETCH_INVOICE_LINK,
        payload: request,
    }
}
export function fetchInvoiceLinkSuccess(posts) {
    return {
        type: FETCH_INVOICE_LINK_SUCCESS,
        payload: posts
    };
}

export function fetchInvoiceLinkFailure(error) {

    return {
        type: FETCH_INVOICE_LINK_FAILURE,
        payload: error
    };
}