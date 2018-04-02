import { connect } from 'react-redux'
import { getUserData, getUserDataSuccess, getUserDataFailure, updateUser, updateUserSuccess, updateUserFailure} from '../user/actions'
import {updateSubordinate, updateSubordinateSuccess, updateSubordinateFailure, fetchSubordinate, fetchSubordinateSuccess, fetchSubordinateFailure } from './actions'
import { fetchObjects,fetchObjectsSuccess,fetchObjectsFailure} from '../objectsList/actions';
import Subordinate from './Subordinate';
import { SubmissionError } from 'redux-form'

const mapStateToProps = (state, ownProps) => {
    const user = state.user
    let initialValues = {}
    if(user){
        initialValues = {
            lastName: user.user.lastName,
            secondName: user.user.secondName,
            name: user.user.name,
            phone: user.data && user.data.phone
        }
        initialValues['subordinate'] = []
        if(state.subordinate && state.subordinate.subordinates && typeof state.subordinate.subordinates === 'object') {
            for(let sub of state.subordinate.subordinates) {
                let item = {id: sub['ID']};
                item.objects = sub['OBJECTS'] || []
                if(sub.ACTIVE === 'N'){
                    item = {...item,
                        email: sub['EMAIL'],
                        phone: sub['PERSONAL_MOBILE'],
                        name: sub['NAME'],
                        lastName: sub['LAST_NAME'],
                        secondName: sub['SECOND_NAME'],
                        workPosition: sub['WORK_POSITION']
                    }
                }
                initialValues['subordinate'].push(item)
            }
        }
    }
    let objects = {}
    if(state.objectsList.objects){
        const objectsList = state.objectsList.objects
        for(let o in objectsList){
            const obj = objectsList[o]
            objects[obj.ID] = obj.NAME
        }
    }
    return {
        user: state.user,
        subordinate: state.subordinate,
        objects: objects,
        initialValues: initialValues,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        getUser:() => {
            const token = localStorage.getItem('jwtToken')
            return dispatch(getUserData(token)).then(result => {
                if (result.payload.response && result.payload.response.status !== 200) {
                    dispatch(getUserDataFailure(result.payload.response.data));
                }else {
                    dispatch(getUserDataSuccess(result.payload.data));
                }
            })
        },
        fetchObjects: (search) => {
            const token = localStorage.getItem('jwtToken')
            dispatch(fetchObjects(token, search)).then((response) => {
                if(!response.error) {
                    dispatch(fetchObjectsSuccess(response.payload))
                }else{
                    dispatch(fetchObjectsFailure(response.payload));
                }
            });
        },
        fetchSubordinates: () => {
            const token = localStorage.getItem('jwtToken')
            dispatch(fetchSubordinate(token)).then((response) => {
                if(!response.error) {
                    dispatch(fetchSubordinateSuccess(response.payload.data))
                }else{
                    dispatch(fetchSubordinateFailure(response.payload));
                }
            });
        },
        validateAndUpdateSubordinate: (values) => {
            const token = localStorage.getItem('jwtToken')
            return dispatch(updateSubordinate(values, token))
                .then(result => {
                    if (result.payload.response && result.payload.response.status !== 200) {
                        dispatch(updateSubordinateFailure(result.payload.response));
                    }else {
                        dispatch(updateSubordinateSuccess(result.payload.data))
                    }
                });
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Subordinate);