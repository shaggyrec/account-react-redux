import { connect } from 'react-redux'
import { fetchObject, fetchObjectSuccess, fetchObjectFailure, resetActiveObject } from './actions';
import ObjectMain from './ObjectMain'

function mapStateToProps(globalState, ownProps) {
    //console.log(ownProps);
    return {
        activeObject: globalState.activeObject,
        objectId: ownProps.id,
    };
}
const mapDispatchToProps = (dispatch) => {

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
        },
        resetMe: () => {
            //clean up both activePost(currrently open) and deletedPost(open and being deleted) states
            dispatch(resetActiveObject());
            //dispatch(resetDeletedPost());
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ObjectMain);