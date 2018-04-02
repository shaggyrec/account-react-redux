import { connect } from 'react-redux'
import { fetchPageText, fetchPageTextSuccess, fetchPageTextFailure, resetPageText} from './actions';
import PageText from './PageText';


const mapStateToProps = (state, ownProps) => {
    return {
        page: ownProps.page,
        pageText:state.pageText
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        fetchPageText: (page,token) => {
            dispatch(fetchPageText(page,token)).then((response) => {
                if(!response.error) {
                    dispatch(fetchPageTextSuccess(response.payload))
                }else{
                    dispatch(fetchPageTextFailure(response.payload));
                }
            });
        },
        resetMe: () => {
             dispatch(resetPageText())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PageText);