import { connect } from 'react-redux'
import RoomsAddForm from './RoomsAddForm'
import { createRoom, createRoomSuccess, createRoomFailure, resetNewRoom, fetchTypes, fetchTypesSuccess, fetchTypesFailure } from './actions';
import { fetchObject, fetchObjectSuccess, fetchObjectFailure, resetActiveObject} from '../objectmain/actions';
import { SubmissionError } from 'redux-form'

function mapStateToProps(globalState, ownProps) {
    const types = globalState.rooms.roomTypes && globalState.rooms.roomTypes.types
    let typesList = {}
    if(types){
        types.map(type => {
            typesList[type.ID] = type.VALUE
        })
    }
    return {
        activeObject: globalState.activeObject,
        objectId: ownProps.object,
        newRoom: globalState.rooms && globalState.rooms.newRoom,
        roomTypes: globalState.rooms && globalState.rooms.roomTypes,
        typesList: typesList,
        initialValues: {
            parent: ownProps.object,
        }
    };
}
const mapDispatchToProps = (dispatch) => {
    return {
        resetMe: () => {
            dispatch(resetNewRoom());
        },
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
        resetActiveObject: () => {
            dispatch(resetActiveObject())
        }
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(RoomsAddForm);