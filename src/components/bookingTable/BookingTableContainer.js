import {connect} from 'react-redux'
import BookingTable from './BookingTable'
import {fetchObject, fetchObjectSuccess, fetchObjectFailure} from '../objectmain/actions';

function mapStateToProps(globalState, ownProps) {
    let initialValues = {};
    return {
        activeObject: globalState.activeObject,
        objectId: ownProps.objectId,
        initialValues: initialValues
    };
}

const mapDispatchToProps = (dispatch, ownProps) => {
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingTable);