import ObjectDistances from './ObjectDistances';
import {connect} from 'react-redux'
import {initialize} from 'redux-form'
import {fetchObject, fetchObjectSuccess, fetchObjectFailure, resetActiveObject} from '../objectmain/actions'
import {updateObject, updateObjectFailure, updateObjectSuccess} from '../objectmain/actions'
import {SubmissionError} from 'redux-form'


function mapStateToProps(globalState, ownProps) {
    // эти массивы по индексам должны совпадать с теми, что здесь /src/components/howToGetHere/ObjectHowToGetHere.js, в методе renderFieldArray
    let measureItems = [0, 'Минут', 'Километры', 'Метров', 'Минуты', 'Минута', 'Метры', 'Метр'],
        transportItems = [0, 'нет', 'на авто', 'на транспорте'];
    if (globalState.activeObject.object && globalState.activeObject.object.PROPS.RASSTOYANIYA) {
        for (let key in globalState.activeObject.object.PROPS.RASSTOYANIYA.VALUE) {
            if (globalState.activeObject.object.PROPS.RASSTOYANIYA.VALUE[key].name_ed_izmereniya && Array.isArray(globalState.activeObject.object.PROPS.RASSTOYANIYA.VALUE[key].name_ed_izmereniya)) {
                globalState.activeObject.object.PROPS.RASSTOYANIYA.VALUE[key].name_ed_izmereniya = globalState.activeObject.object.PROPS.RASSTOYANIYA.VALUE[key].name_ed_izmereniya[0];
            }
            if (globalState.activeObject.object.PROPS.RASSTOYANIYA.VALUE[key].na_chem && Array.isArray(globalState.activeObject.object.PROPS.RASSTOYANIYA.VALUE[key].na_chem)) {
                globalState.activeObject.object.PROPS.RASSTOYANIYA.VALUE[key].na_chem = globalState.activeObject.object.PROPS.RASSTOYANIYA.VALUE[key].na_chem[0];
            }
            if (globalState.activeObject.object.PROPS.RASSTOYANIYA.VALUE[key].length < 1) {
                globalState.activeObject.object.PROPS.RASSTOYANIYA.VALUE = [];
            }
        }
    }
    return {
        activeObject: globalState.activeObject,
        objectId: ownProps.id,
        initialValues: {
            RASSTOYANIYA: globalState.activeObject.object && globalState.activeObject.object.PROPS.RASSTOYANIYA.VALUE,
            ITEMS_ID: globalState.activeObject.object && globalState.activeObject.object.PROPS.RASSTOYANIYA.PROPERTY_VALUE_ID
        },
    };
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        fetchObject: (id, token) => {
            dispatch(fetchObject(id, token))
                .then((result) => {
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
                //dispatch(updateObjectFailure(data));
                throw new SubmissionError(data);
            }
            if (values.RASSTOYANIYA) {
                values.RASSTOYANIYA.map(function (curVal, index) {
                    if (curVal.name_obect && curVal.name_obect.value) {
                        values.RASSTOYANIYA[index].name_obect = curVal.name_obect.value;
                    }
                });
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

export default connect(mapStateToProps, mapDispatchToProps)(ObjectDistances);