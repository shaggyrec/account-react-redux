import { connect } from 'react-redux'
import { fetchObject, fetchObjectSuccess, fetchObjectFailure, resetActiveObject, updateObject, updateObjectSuccess, updateObjectFailure } from './actions';
import ObjectContacts from './ObjectContacts'
import { SubmissionError } from 'redux-form'

function mapStateToProps(globalState, ownProps) {
    return {
        activeObject: globalState.activeObject,
        objectId: ownProps.id,
        initialValues: {
            // FORM_PUBLIK_PHONE:globalState.activeObject.object && globalState.activeObject.object.PROPS.FORM_PUBLIK_PHONE.VALUE,
            SKYPE: globalState.activeObject.object && globalState.activeObject.object.PROPS && globalState.activeObject.object.PROPS.SKYPE.VALUE,
            telefon3: globalState.activeObject.object && globalState.activeObject.object.PROPS && globalState.activeObject.object.PROPS.telefon3.VALUE,
            SAIT:globalState.activeObject.object && globalState.activeObject.object.PROPS && globalState.activeObject.object.PROPS.SAIT.VALUE,
            mail1: globalState.activeObject.object && globalState.activeObject.object.PROPS && globalState.activeObject.object.PROPS.mail1.VALUE,
            mail2: globalState.activeObject.object && globalState.activeObject.object.PROPS && globalState.activeObject.object.PROPS.mail2.VALUE,
            mail3: globalState.activeObject.object && globalState.activeObject.object.PROPS && globalState.activeObject.object.PROPS.mail3.VALUE,
            NO_SHOW_EMAIL: globalState.activeObject.object && globalState.activeObject.object.PROPS && globalState.activeObject.object.PROPS.NO_SHOW_EMAIL.VALUE === 'Y'? true: false,
            telefon1:  globalState.activeObject.object && globalState.activeObject.object.PROPS.telefon1.VALUE
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


export default connect(mapStateToProps, mapDispatchToProps)(ObjectContacts);