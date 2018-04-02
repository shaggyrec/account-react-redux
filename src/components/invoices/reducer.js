import { FETCH_INVOICES, FETCH_INVOICES_SUCCESS, FETCH_INVOICES_FAILURE, RESET_INVOICES,
    FETCH_INVOICE_LINK, FETCH_INVOICE_LINK_SUCCESS, FETCH_INVOICE_LINK_FAILURE
} from './constants';

const INITIAL_STATE = {
    invoicesList:{invoices: [], error:null, loading: false}
}

export default function(state = INITIAL_STATE, action) {
    let error;
    switch (action.type) {

        case FETCH_INVOICES:
            return {...state, invoicesList:{invoices: [], error: null, loading: true}}
        case FETCH_INVOICES_SUCCESS:
            return {...state, invoicesList:{invoices: action.payload.data, error: null, loading: false}}
        case FETCH_INVOICES_FAILURE:
            error = action.payload.response.data || {message: action.payload.message};//2nd one is network or server down errors
            return {...state, invoicesList:{invoices: [], error: error, loading: false}}
        case RESET_INVOICES:
            return {...state, invoicesList:{invoices: [], error: null, loading: false}}
        case FETCH_INVOICE_LINK:
            return {...state, invoicesList:{invoices: state.invoicesList.invoices, error:null, loading: true}}
        case FETCH_INVOICE_LINK_SUCCESS:
            let invoices = state.invoicesList.invoices.map(invoice => {
                if(invoice['ID'] == action.payload.data.id){
                    invoice['LINK'] = action.payload.data.link
                }
                return invoice
            })
            return {...state, invoicesList:{invoices: invoices, error:null, loading: false}}
        case FETCH_INVOICE_LINK_FAILURE:
            error = action.payload.response.data || {message: action.payload.message}
            return {...state, invoicesList:{invoices: state.invoicesList.invoices, error:error, loading: false}}
        default:
            return state;
    }
}