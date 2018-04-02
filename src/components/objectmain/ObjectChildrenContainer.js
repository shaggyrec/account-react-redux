import {connect} from 'react-redux'
import ObjectChildren from './ObjectChildren'
import {
    fetchObject,
    fetchObjectSuccess,
    fetchObjectFailure,
    resetActiveObject,
    updateObject,
    updateObjectSuccess,
    updateObjectFailure,
} from './actions';
import {updateObjectPropsGroup} from '../serviceGroupForm/actions'
import {SubmissionError} from 'redux-form'

function mapStateToProps(globalState, ownProps) {
    let initialValues = {};
    if (globalState.activeObject && globalState.activeObject.object && globalState.activeObject.object.PROPS && ownProps && ownProps.groupName && ownProps.id) {
        const props = globalState.activeObject.object.PROPS;
        for (let prop in props) {
            if (prop == ownProps.groupName) {
                initialValues[prop] = {};
                for (let val in props[prop]['all']) {
                    initialValues[prop][ownProps.groupName + '_' + val] = {
                        name: props[prop]['all'][val],
                        index: val,
                        value: !props[prop]['VALUE_ENUM_ID'] || props[prop]['VALUE_ENUM_ID'].indexOf(val) === -1 ? false : true
                    };
                }
            }
        }
        initialValues['DETI_TEXT'] = props.DETI_TEXT.VALUE && props.DETI_TEXT.VALUE.TEXT
    }
    return {
        activeObject: globalState.activeObject,
        objectId: ownProps.id,
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
        validateAndUpdateObject: (values) => {
            let token = localStorage.getItem('jwtToken');
            if (!token || token === '') {
                //if there is no token, dont bother,
                var data = {data: {message: 'Please Sign In'}}; //axios like error
                dispatch(updateObjectFailure(data));
                // throw new SubmissionError(data);
            }
            let actionData = {
                PROP_GROUP: {
                    PROPS: values[ownProps.groupName],
                    GROUP_NAME: ownProps.groupName
                }
            };
            if (values.hasOwnProperty('DETI_TEXT')) {
                actionData['DETI_TEXT'] = values['DETI_TEXT'];
            }
            return dispatch(updateObjectPropsGroup(ownProps.id, ownProps.groupName, actionData, token))
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


export default connect(mapStateToProps, mapDispatchToProps)(ObjectChildren);