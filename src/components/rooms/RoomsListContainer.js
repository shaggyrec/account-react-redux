import { connect } from 'react-redux'
import { fetchRooms,fetchRoomsSuccess,fetchRoomsFailure, deleteRoom, deleteRoomSuccess ,deleteRoomFailure, resetDeletedRoom, resetRooms} from './actions';
import { fetchObject, fetchObjectSuccess, fetchObjectFailure, resetActiveObject} from '../objectmain/actions';
import RoomsList from './RoomsList';


const mapStateToProps = (state, ownProps) => {
    return {
        objectId: ownProps.object,
        activeObject: state.activeObject,
        rooms: state.rooms.roomsList,
        deletedRoom: state.rooms.deletedRoom
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
                        if(result.payload.data.PROPS.NOMERA.VALUE) {
                            dispatch(fetchRooms(result.payload.data.PROPS.NOMERA.VALUE, token)).then((response) => {
                                if (!response.error) {
                                    dispatch(fetchRoomsSuccess(response.payload))
                                } else {
                                    dispatch(fetchRoomsFailure(response.payload));
                                }
                            })
                        }else{
                            dispatch(fetchRoomsSuccess([]))
                        }
                    }
                })
        },
        fetchRooms: (id, token) => {
            if(!id){
                return
            }
            dispatch(fetchRooms(id, token)).then((response) => {
                if (!response.error) {
                    dispatch(fetchRoomsSuccess(response.payload))
                } else {
                    dispatch(fetchRoomsFailure(response.payload));
                }
            })
        },
        deleteRoom: (id) => {
            if(window.confirm('Вы действительно хотите удалить номер? Отменить это действие будет невозможно!')) {
                const token = localStorage.getItem('jwtToken');
                dispatch(deleteRoom(id,token)).then((response) => {
                    if (!response.error) {
                        dispatch(deleteRoomSuccess(response.payload))
                    } else {
                        dispatch(deleteRoomFailure(response.payload));
                    }
                })
            }
        },
        resetMe: () =>{
            dispatch(resetDeletedRoom());
            dispatch(resetRooms())

        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomsList);