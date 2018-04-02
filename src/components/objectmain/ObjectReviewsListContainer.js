import { connect } from 'react-redux'
import { fetchObject, fetchObjectSuccess, fetchObjectFailure, resetActiveObject } from './actions';
import ObjectReviewsList from './ObjectReviewsList'

function mapStateToProps(globalState, ownProps) {
    return {
        activeObject: globalState.activeObject,
        reviews: globalState.activeObject && globalState.activeObject.object && globalState.activeObject.object.reviews,
        objectId: ownProps.id,
    }
}
const mapDispatchToProps = (dispatch,ownProps) => {

    return {
        fetchObject: (id, token) => {
            dispatch(fetchObject(id, token))
                .then((result) => {
                    // Note: Error's "data" is in result.payload.response.data (inside "response")
                    // success's "data" is in result.payload.data
                    if (result.payload.response && result.payload.response.status !== 200) {
                        dispatch(fetchObjectFailure(result.payload.response.data));
                    } else {
                        dispatch(fetchObjectSuccess(result.payload.data))
                    }
                })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ObjectReviewsList);
