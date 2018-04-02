import { FETCH_ROOMS, FETCH_ROOMS_SUCCESS, FETCH_ROOMS_FAILURE, RESET_ROOMS,
    CREATE_ROOM, CREATE_ROOM_SUCCESS, CREATE_ROOM_FAILURE, RESET_NEW_ROOM,
    FETCH_TYPES, FETCH_TYPES_SUCCESS, FETCH_TYPES_FAILURE,
    FETCH_ROOM, FETCH_ROOM_SUCCESS, FETCH_ROOM_FAILURE, RESET_ACTIVE_ROOM,
    UPDATE_ROOM, UPDATE_ROOM_SUCCESS, UPDATE_ROOM_FAILURE,
    DELETE_ROOM ,DELETE_ROOM_SUCCESS, DELETE_ROOM_FAILURE, RESET_DELETED_ROOM,
    UPLOAD_ROOM_PHOTOS, UPLOAD_ROOM_PHOTOS_SUCCESS, UPLOAD_ROOM_PHOTOS_FAILURE,
    DELETE_ROOM_PHOTO, DELETE_ROOM_PHOTO_SUCCESS, DELETE_ROOM_PHOTO_FAILURE,
    UPDATE_ROOMS_CALENDAR, UPDATE_ROOMS_CALENDAR_SUCCESS, UPDATE_ROOMS_CALENDAR_FAILURE,
    UPDATE_ROOMS_CALENDAR_BY_PERIOD, UPDATE_ROOMS_CALENDAR_BY_PERIOD_SUCCESS, UPDATE_ROOMS_CALENDAR_BY_PERIOD_FAILURE,
    CHANGE_ROOMS_CALENDAR_TYPE, CHANGE_ROOMS_CALENDAR_TYPE_SUCCESS, CHANGE_ROOMS_CALENDAR_TYPE_FAILURE
} from './constants';

const INITIAL_STATE = {
    roomsList: { roomsList:[], error:null, loading: false},
    newRoom:{room:null, error: null, loading: false},
    roomTypes: {types:null, error:null, loading:false},
    activeRoom:{room:null, error:null, loading: false},
    deletedRoom: {room:null, error:null, loading: false}
}

export default function(state = INITIAL_STATE, action) {
    let error;
    switch (action.type) {

        case FETCH_ROOMS:
            return {...state, roomsList: {roomsList:[], error: null, loading: true}};
        case FETCH_ROOMS_SUCCESS:
            return {...state, roomsList: {roomsList:action.payload.data, error: null, loading: false}};
        case FETCH_ROOMS_FAILURE:
            error = action.payload.response.data || {message: action.payload.message};//2nd one is network or server down errors
            return {...state, roomsList:{roomsList: [], error: error, loading: false}}
        case RESET_ROOMS:
            return {...state, roomsList:{roomsList: [], error: null, loading: false}}
        case CREATE_ROOM:
            return {...state, newRoom: {...state.newRoom, loading: true}}
        case CREATE_ROOM_SUCCESS:
            return {...state, newRoom: {room:action.payload, error:null, loading: false}}
        case CREATE_ROOM_FAILURE:
            error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
            return {...state, newRoom: {room:null, error:error, loading: false}}
        case RESET_NEW_ROOM:
            return {...state,  newRoom:{room:null, error:null, loading: false}}
        case FETCH_TYPES:
            return {...state, roomTypes:{ types:[],error:false, loading: true}}
        case FETCH_TYPES_SUCCESS:
            return {...state, roomTypes:{ types:action.payload,error:false, loading: false}}
        case FETCH_TYPES_FAILURE:
            error = action.payload || {message: action.payload.message};//2nd one is network or server down errors
            return {...state, roomTypes:{ types:[],error:error, loading: false}}
        case FETCH_ROOM:
            return {...state, activeRoom:{room:null, loading: true, error:null}};
        case FETCH_ROOM_SUCCESS:
            return {...state, activeRoom:{room: action.payload, error: null, loading: false}}
        case FETCH_ROOM_FAILURE:
            error = action.payload || {message: action.payload.message};//2nd one is network or server down errors
            return {...state,activeRoom:{room: null, error: error, loading: false}}
        case RESET_ACTIVE_ROOM:
            return {...state, activeRoom:{room: null, error: null, loading: false}}
        case UPDATE_ROOM:
            return {...state, activeRoom:{room: {...state.activeRoom.room}, loading: true}}
        case UPDATE_ROOM_SUCCESS:
            return {...state, activeRoom:{room:action.payload, error:null, loading: false}}
        case UPDATE_ROOM_FAILURE:
            error =  action.payload.message ? action.payload : {message: action.payload}
            return {...state, activeRoom:{room: {...state.activeRoom.room}, error:error, loading: false}}
        case DELETE_ROOM:
            return {...state, deletedRoom: {...state.deletedRoom, loading: true}}
        case DELETE_ROOM_SUCCESS:
            return {...state, deletedRoom: {room:action.payload, error:null, loading: false}}
        case DELETE_ROOM_FAILURE:
            error = action.payload.response.data || {message: action.payload.message};//2nd one is network or server down errors
            return {...state, deletedRoom: {room:null, error:error, loading: false}}
        case UPLOAD_ROOM_PHOTOS:
            return {...state, activeRoom:{...state.activeRoom, loading: true}}
        case UPLOAD_ROOM_PHOTOS_SUCCESS:
            return {...state, activeRoom:{room:action.payload, error:null, loading: false}}
        case UPLOAD_ROOM_PHOTOS_FAILURE:
            error = !action.payload.data ? action.payload : {message: action.payload.data.message};
            return {...state, activeRoom:{...state.activeRoom, error:error, loading: false}}
        case DELETE_ROOM_PHOTO:
            return {...state, activeRoom:{...state.activeRoom, loading: true}}
        case DELETE_ROOM_PHOTO_SUCCESS:
            return {...state, activeRoom:{room:action.payload, error:null, loading: false}}
        case DELETE_ROOM_PHOTO_FAILURE:
            error = !action.payload.data ? action.payload : {message: action.payload.data.message};
            return {...state, activeRoom:{...state.activeRoom, error:error, loading: false}}
        case RESET_DELETED_ROOM:
            return {...state,  deletedRoom:{room:null, error:null, loading: false}}
        case UPDATE_ROOMS_CALENDAR:
        case  UPDATE_ROOMS_CALENDAR_BY_PERIOD:
            return {...state, roomsList: {...state.roomsList, error: null, loading: false}};
        case UPDATE_ROOMS_CALENDAR_SUCCESS:
        case  UPDATE_ROOMS_CALENDAR_BY_PERIOD_SUCCESS:
            const editedRoom = action.payload
            let rooms = state.roomsList.roomsList.map((room)=>{
                if(room && room.ID === editedRoom.ID) return editedRoom
                return room
            })
            return {...state, roomsList: {roomsList: rooms, error: null, loading: false}};
        case  UPDATE_ROOMS_CALENDAR_FAILURE:
        case  UPDATE_ROOMS_CALENDAR_BY_PERIOD_FAILURE:
            return {...state, roomsList: {...state.roomsList, error: action.payload, loading: false}};
        case CHANGE_ROOMS_CALENDAR_TYPE:
            return {...state, activeRoom:{room:action.payload, error:null, loading: false}}
        case CHANGE_ROOMS_CALENDAR_TYPE_SUCCESS:
            return {...state, activeRoom:{room:action.payload, error:null, loading: false}}
        case CHANGE_ROOMS_CALENDAR_TYPE_FAILURE:
            error = action.payload.data || {message: action.payload.data.message};
            return {...state, activeRoom:{room: {...state.activeRoom.room}, error:error, loading: false}}
        default:
            return state;
    }
}