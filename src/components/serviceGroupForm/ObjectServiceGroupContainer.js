import {connect} from 'react-redux'
import ObjectServiceGroup from './ObjectServiceGroup'
import {updateObjectPropsGroup, updateObjectPropsGroupFailure, updateObjectPropsGroupSuccess} from './actions'
import {SubmissionError} from 'redux-form'

function mapStateToProps(globalState, ownProps) {
    let initialValues = {};
    if (globalState.activeObject && globalState.activeObject.object && globalState.activeObject.object.PROPS && ownProps && ownProps.groupName && ownProps.objectId) {
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
        if (ownProps.groupName == 'oplata') {
            initialValues['REKVIZIT'] = props.REKVIZIT.VALUE;
        }
    }
    return {
        activeObject: globalState.activeObject,
        objectId: ownProps.objectId,
        initialValues: initialValues
    };
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        validateAndUpdateObjectPropsGroup: (values) => {
            let token = localStorage.getItem('jwtToken');
            if (!token || token === '') {
                //if there is no token, dont bother,
                var data = {data: {message: 'Please Sign In'}}; //axios like error
                dispatch(updateObjectPropsGroupFailure(data));
                // throw new SubmissionError(data);
            }
            let actionData = {
                PROP_GROUP: {
                    PROPS: values[ownProps.groupName],
                    GROUP_NAME: ownProps.groupName
                }
            };
            if (ownProps.groupName == "oplata") {
                actionData.PROP_GROUP.PROPS['REKVIZIT'] = values['REKVIZIT'];
            }
            return dispatch(updateObjectPropsGroup(ownProps.objectId, ownProps.groupName, actionData, token))
                .then(result => {
                    // Note: Error's "data" is in result.payload.response.data (inside "response")
                    // success's "data" is in result.payload.data
                    if (result.payload.response && result.payload.response.status !== 200) {
                        dispatch(updateObjectPropsGroupFailure(result.payload.response.data));
                        throw new SubmissionError(result.payload.response.data);
                    }
                    //let other components know that everything is fine by updating the redux` state
                    dispatch(updateObjectPropsGroupSuccess(result.payload.data)); //ps: this is same as dispatching RESET_USER_FIELDS
                });
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ObjectServiceGroup);
