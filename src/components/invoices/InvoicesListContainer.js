import { connect } from 'react-redux'
import { fetchInvoices,fetchInvoicesSuccess,fetchInvoicesFailure, fetchInvoiceLink, fetchInvoiceLinkSuccess, fetchInvoiceLinkFailure} from './actions';
import InvoicesList from './InvoicesList';


const mapStateToProps = (state, ownProps) => {
    return {
        user: state.user.user,
        invoices: state.invoices.invoicesList
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    const token = localStorage.getItem('jwtToken')
    return {
        fetchInvoices: (search) => {
            dispatch(fetchInvoices(token, search)).then((response) => {
                if(!response.error) {
                    dispatch(fetchInvoicesSuccess(response.payload))
                }else{
                    dispatch(fetchInvoicesFailure(response.payload));
                }
            });
        },
        fetchInvoiceLink: (id) => {

            dispatch(fetchInvoiceLink(id, token)).then(response => {
                if(!response.error){
                    dispatch(fetchInvoiceLinkSuccess(response.payload))
                }else{
                    dispatch(fetchInvoiceLinkFailure(response.payload))
                }
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InvoicesList);