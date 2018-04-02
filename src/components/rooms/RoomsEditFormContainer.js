import { connect } from 'react-redux'
import { fetchRoom, fetchRoomSuccess, fetchRoomFailure,updateRoom,updateRoomSuccess, updateRoomFailure, fetchTypes, fetchTypesSuccess, fetchTypesFailure, resetActiveRoom,
uploadRoomPhotos, uploadRoomPhotosSuccess, uploadRoomPhotosFailure, deleteRoomPhoto, deleteRoomPhotoSuccess, deleteRoomPhotoFailure} from './actions';
import { fetchObject, fetchObjectSuccess, fetchObjectFailure, resetActiveObject} from '../objectmain/actions';
import RoomsEditForm from './RoomsEditForm'
import { SubmissionError } from 'redux-form'

function mapStateToProps(globalState, ownProps) {
    let initialValues = {
        NAME:globalState.rooms.activeRoom.room && globalState.rooms.activeRoom.room.NAME
    }
    if (globalState.rooms.activeRoom.room){
        const props = globalState.rooms.activeRoom.room.PROPS
        for (let prop in props) {
            if(prop === 'udobstva_nomere' ||
                prop === 'tehno_nomere' ||
                prop === 'vannaya' ||
                prop === 'pitanie_nomere' ||
                prop === 'vid_okno'
            ){
                initialValues[prop] = []
                for(let val in props[prop]['all']){
                    initialValues[prop][val] = {}
                    initialValues[prop][val] = !props[prop]['VALUE_ENUM_ID'] || props[prop]['VALUE_ENUM_ID'].indexOf(val) === -1 ? false : true
                }
            }
        }
        initialValues.TYPE = props.TYPE.VALUE_ENUM_ID
        initialValues.GOS_OT = +(props.GOS_OT.VALUE)
        initialValues.GOS_DO = +(props.GOS_DO.VALUE)
        initialValues.PLO = +(props.PLO.VALUE)
        initialValues.VSEGO = +(props.VSEGO.VALUE)
        initialValues.USER_TYPE = props.USER_TYPE.VALUE
        initialValues.parent = ownProps.object
        initialValues.EXTRA_COUNT_TO = props.EXTRA_COUNT_TO.VALUE
        initialValues.CHILD_COUNT_TO = props.CHILD_COUNT_TO.VALUE
    }
    const types = globalState.rooms.roomTypes && globalState.rooms.roomTypes.types
    let typesList = {}
    if(types){
         types.map(type => {
             typesList[type.ID] = type.VALUE
         })
    }

    return {
        objectId: ownProps.object,
        user: globalState.user.user,
        activeObject:globalState.activeObject,
        activeRoom: globalState.rooms.activeRoom,
        roomId: ownProps.id,
        roomTypes: globalState.rooms.roomTypes,
        initialValues: initialValues,
        typesList: typesList
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
        fetchRoom: (id, token) => {
            dispatch(fetchRoom(id, token))
                .then((result) => {
                    // Note: Error's "data" is in result.payload.response.data (inside "response")
                    // success's "data" is in result.payload.data
                    if (result.payload.response && result.payload.response.status !== 200) {
                        dispatch(fetchRoomFailure(result.payload.response.data));
                    } else {
                        dispatch(fetchRoomSuccess(result.payload.data))
                    }
                })
        },
        validateAndUpdateRoom: (values) => {
            let token = localStorage.getItem('jwtToken');
            if (!token || token === '') {
                //if there is no token, dont bother,
                var data = { data: { message: 'Please Sign In' } }; //axios like error
                dispatch(updateRoomFailure(data));
                return
                //throw new SubmissionError(data);
            }
            // if(values.picture){
                let formData = new FormData()
                for(let prop in values){
                    if(prop == 'picture'){
                        var i = 0;
                        for ( let val in values[prop]) {
                            let file = values[prop][val]
                            // add the files to formData object for the data payload
                            if(typeof file !== 'function') {
                                formData.append(`picture[${i}]`, file, file.name);
                                i++
                            }
                        }
                    }else if(values[prop] && typeof(values[prop]) === 'object') {
                        var i = 0;
                        for(let item of values[prop]){
                            if(item) {
                                formData.append(prop + '[' + i + ']', item)
                            }
                            i++
                        }
                    }else if(values[prop]) {
                        formData.append(prop, values[prop])
                    }
                }
                values = formData
            // }

            return dispatch(updateRoom(ownProps.id, values, token))
                .then(result => {
                    // Note: Error's "data" is in result.payload.response.data (inside "response")
                    // success's "data" is in result.payload.data
                    if (result.payload.response && result.payload.response.status !== 200) {
                        dispatch(updateRoomFailure(result.payload.response.data));
                        return
                        //throw new SubmissionError(result.payload.response.data);
                    }
                    //let other components know that everything is fine by updating the redux` state
                    dispatch(updateRoomSuccess(result.payload.data)); //ps: this is same as dispatching RESET_USER_FIELDS
                });
        },
        fetchRoomTypes: () => {
            const token = localStorage.getItem('jwtToken');
            dispatch(fetchTypes(token))
                .then((result) => {
                    // Note: Error's "data" is in result.payload.response.data (inside "response")
                    // success's "data" is in result.payload.data
                    if (result.payload.response && result.payload.response.status !== 200) {
                        dispatch(fetchTypesFailure(result.payload.response.data));
                    } else {
                        dispatch(fetchTypesSuccess(result.payload.data))
                    }
                })
        },
        deletePhoto: (photoId) => {
            let token = localStorage.getItem('jwtToken');
            if (!token || token === '') {
                //if there is no token, dont bother,
                var data = { data: { message: 'Please Sign In' } }; //axios like error
                dispatch(uploadRoomPhotosFailure(data));
                // throw new SubmissionError(data);
            }
            return dispatch(deleteRoomPhoto(ownProps.id, photoId, token))
                .then(result => {
                    // Note: Error's "data" is in result.payload.response.data (inside "response")
                    // success's "data" is in result.payload.data
                    if (result.payload.response && result.payload.response.status !== 200) {
                        dispatch(deleteRoomPhotoFailure(result.payload.response.data));
                        // throw new SubmissionError(result.payload.response.data);
                    }
                    //let other components know that everything is fine by updating the redux` state
                    dispatch(deleteRoomPhotoSuccess(result.payload.data)); //ps: this is same as dispatching RESET_USER_FIELDS
                });
        },
        resetMe: () => {
            //clean up both activePost(currrently open) and deletedPost(open and being deleted) states
            dispatch(resetActiveRoom());
            //dispatch(resetDeletedPost());
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(RoomsEditForm);