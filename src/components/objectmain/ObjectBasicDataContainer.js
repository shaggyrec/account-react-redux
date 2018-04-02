import { connect } from 'react-redux'
import { fetchObject, fetchObjectSuccess, fetchObjectFailure, resetActiveObject, updateObject, updateObjectSuccess, updateObjectFailure } from './actions'
import ObjectBasicData from './ObjectBasicData'
import { SubmissionError } from 'redux-form'

function mapStateToProps(globalState, ownProps) {
    return {
        activeObject: globalState.activeObject,
        objectId: ownProps.id,
        initialValues: {
            NAME:globalState.activeObject.object && globalState.activeObject.object.NAME.replace(/&quot;/g, '\"'),
            address: globalState.activeObject.object && globalState.activeObject.object.PROPS && globalState.activeObject.object.PROPS.adres.VALUE,
            DETAIL_TEXT: globalState.activeObject.object && globalState.activeObject.object.DETAIL_TEXT,
            opis_nomerov: globalState.activeObject.object && globalState.activeObject.object.PROPS && globalState.activeObject.object.PROPS.opis_nomerov.VALUE,
            KAK_DOBRATSA: globalState.activeObject.object && globalState.activeObject.object.PROPS && globalState.activeObject.object.PROPS.KAK_DOBRATSA.VALUE
        }
    };
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
        },
        validateAndUpdateObject: (values) => {
            let token = localStorage.getItem('jwtToken');
            if (!token || token === '') {
                //if there is no token, dont bother,
                var data = { data: { message: 'Please Sign In' } }; //axios like error
                dispatch(updateObjectFailure(data));
                throw new SubmissionError(data);
            }

           return dispatch(updateObject(ownProps.id, values, token))
                .then(result => {
                    // Note: Error's "data" is in result.payload.response.data (inside "response")
                    // success's "data" is in result.payload.data
                    if (result.payload.response && result.payload.response.status !== 200) {
                        dispatch(updateObjectFailure(result.payload.response.data));
                        throw new SubmissionError(result.payload.response.data);
                    }
                    //let other components know that everything is fine by updating the redux` state
                    dispatch(updateObjectSuccess(result.payload.data)); //ps: this is same as dispatching RESET_USER_FIELDS
                });
        },
        resetMe: () => {
            //clean up both activePost(currrently open) and deletedPost(open and being deleted) states
            dispatch(resetActiveObject());
            //dispatch(resetDeletedPost());
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ObjectBasicData);