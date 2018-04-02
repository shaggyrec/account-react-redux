import ObjectHowToGetHere from './ObjectHowToGetHere';
import {connect} from 'react-redux'
import {initialize} from 'redux-form'
import {fetchObject, fetchObjectSuccess, fetchObjectFailure, resetActiveObject} from '../objectmain/actions'
import {updateObject, updateObjectFailure, updateObjectSuccess} from '../objectmain/actions'
import {SubmissionError} from 'redux-form'


function mapStateToProps(globalState, ownProps) {
    // эти массивы по индексам должны совпадать с теми, что здесь /src/components/howToGetHere/ObjectHowToGetHere.js, в методе renderFieldArray
    let fromItems = [0, 'Аэропорт', 'ж/д вокзал', 'Автовокзал'],
        transportItems = [0, 'автобус', 'тролейбус', 'маршрутка', 'такси', 'электричка'];
    if (globalState.activeObject.object && globalState.activeObject.object.PROPS.KAK_DOBRATSA) {
        for (let key in globalState.activeObject.object.PROPS.KAK_DOBRATSA.VALUE) {
            if (globalState.activeObject.object.PROPS.KAK_DOBRATSA.VALUE[key].type_obect && Array.isArray(globalState.activeObject.object.PROPS.KAK_DOBRATSA.VALUE[key].type_obect)) {
                globalState.activeObject.object.PROPS.KAK_DOBRATSA.VALUE[key].type_obect = globalState.activeObject.object.PROPS.KAK_DOBRATSA.VALUE[key].type_obect[0];
            }
            if (globalState.activeObject.object.PROPS.KAK_DOBRATSA.VALUE[key].type_transport && Array.isArray(globalState.activeObject.object.PROPS.KAK_DOBRATSA.VALUE[key].type_transport)) {
                globalState.activeObject.object.PROPS.KAK_DOBRATSA.VALUE[key].type_transport = globalState.activeObject.object.PROPS.KAK_DOBRATSA.VALUE[key].type_transport[0];
            }
            if (globalState.activeObject.object.PROPS.KAK_DOBRATSA.VALUE[key].length < 1)
            {
                globalState.activeObject.object.PROPS.KAK_DOBRATSA.VALUE = [];
            }
        }
    }
    return {
        activeObject: globalState.activeObject,
        objectId: ownProps.id,
        initialValues: {
            KAK_DOBRATSA: globalState.activeObject.object && globalState.activeObject.object.PROPS.KAK_DOBRATSA.VALUE,
            ITEMS_ID: globalState.activeObject.object && globalState.activeObject.object.PROPS.KAK_DOBRATSA.PROPERTY_VALUE_ID
        },
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
            let newValues = [];
            if (values && values.KAK_DOBRATSA.length)
            {
                values.KAK_DOBRATSA.map(function (curElement, index) {
                    let element = {
                        name_obect: curElement.name_obect,
                        nomer_marshruta: curElement.nomer_marshruta,
                        do_ostanovki: curElement.do_ostanovki,
                        type_obect: [],
                        type_transport: []

                    };
                    if (curElement.type_obect)
                    {
                        element.type_obect.push(curElement.type_obect);
                    }
                    if (curElement.type_transport)
                    {
                        element.type_transport.push(curElement.type_transport);
                    }
                    newValues.push(element);
                });
                values.KAK_DOBRATSA = newValues;
            }
            if (!token || token === '') {
                //if there is no token, dont bother,
                var data = {data: {message: 'Please Sign In'}}; //axios like error
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

export default connect(mapStateToProps, mapDispatchToProps)(ObjectHowToGetHere);