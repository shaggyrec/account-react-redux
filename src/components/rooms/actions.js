import axios from 'axios'
import qs from 'qs'
import { FETCH_ROOMS, FETCH_ROOMS_SUCCESS, FETCH_ROOMS_FAILURE, RESET_ROOMS,
CREATE_ROOM, CREATE_ROOM_SUCCESS, CREATE_ROOM_FAILURE, RESET_NEW_ROOM,
FETCH_TYPES, FETCH_TYPES_SUCCESS, FETCH_TYPES_FAILURE,
FETCH_ROOM, FETCH_ROOM_FAILURE, FETCH_ROOM_SUCCESS, RESET_ACTIVE_ROOM,
UPDATE_ROOM,UPDATE_ROOM_SUCCESS,UPDATE_ROOM_FAILURE,
DELETE_ROOM, DELETE_ROOM_SUCCESS, DELETE_ROOM_FAILURE, RESET_DELETED_ROOM,
    UPLOAD_ROOM_PHOTOS, UPLOAD_ROOM_PHOTOS_SUCCESS, UPLOAD_ROOM_PHOTOS_FAILURE,
    DELETE_ROOM_PHOTO, DELETE_ROOM_PHOTO_SUCCESS, DELETE_ROOM_PHOTO_FAILURE,
    UPDATE_ROOMS_CALENDAR,UPDATE_ROOMS_CALENDAR_SUCCESS, UPDATE_ROOMS_CALENDAR_FAILURE,
    UPDATE_ROOMS_CALENDAR_BY_PERIOD, UPDATE_ROOMS_CALENDAR_BY_PERIOD_SUCCESS, UPDATE_ROOMS_CALENDAR_BY_PERIOD_FAILURE,
    CHANGE_ROOMS_CALENDAR_TYPE, CHANGE_ROOMS_CALENDAR_TYPE_SUCCESS, CHANGE_ROOMS_CALENDAR_TYPE_FAILURE
} from './constants';

const ROOT_URL = 'https://test.edem-v-gosti.ru/lk/api'

export function fetchRooms(roomsIds,tokenFromStorage) {
    //для серевера
    const request = axios({
        method: 'get',
        url:  `${ROOT_URL}/rooms/?ids=${roomsIds.join(',')}&token=${tokenFromStorage}`,
    });

    return {
        type: FETCH_ROOMS,
        payload: request
    };
}

export function fetchRoomsSuccess(posts) {
    return {
        type: FETCH_ROOMS_SUCCESS,
        payload: posts
    };
}

export function fetchRoomsFailure(error) {

    return {
        type: FETCH_ROOMS_FAILURE,
        payload: error
    };
}
export function resetRooms () {
    return {
        type: RESET_ROOMS
    }
}
export function createRoom(formValues,tokenFromStorage) {
    const request = axios({
        method: 'post',
        url:  `${ROOT_URL}/rooms/?token=${tokenFromStorage}`,
        data: qs.stringify(formValues)
    });

    return {
        type: CREATE_ROOM,
        payload: request
    };
}

export function createRoomSuccess(room) {
    return {
        type: CREATE_ROOM_SUCCESS,
        payload: room
    };
}

export function createRoomFailure(error) {

    return {
        type: CREATE_ROOM_FAILURE,
        payload: error
    };
}

export function resetNewRoom() {
    return {
        type: RESET_NEW_ROOM
    }
}
export function fetchTypes(token) {
    const request = axios.get(`${ROOT_URL}/rooms/?act=types&token=${token}`)
    return {
        type: FETCH_TYPES,
        payload: request
    };
}


export function fetchTypesSuccess(types) {
    return {
        type: FETCH_TYPES_SUCCESS,
        payload: types
    };
}

export function fetchTypesFailure(error) {
    return {
        type: FETCH_TYPES_FAILURE,
        payload: error
    };
}
export function fetchRoom(id, tokenFromStorage) {
    const request = axios.get(`${ROOT_URL}/rooms/?id=${id}&token=${tokenFromStorage}`)
    return {
        type: FETCH_ROOM,
        payload: request
    };
}


export function fetchRoomSuccess(activeRoom) {
    return {
        type: FETCH_ROOM_SUCCESS,
        payload: activeRoom
    };
}

export function fetchRoomFailure(error) {
    return {
        type: FETCH_ROOM_FAILURE,
        payload: error
    };
}
export function resetActiveRoom() {
    return {
        type: RESET_ACTIVE_ROOM
    }
}

export function updateRoom(id, props, tokenFromStorage) {

    const request = axios({
        method: 'post',
        data: props,
        url: `${ROOT_URL}/rooms/?update=${id}&token=${tokenFromStorage}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded, multipart/form-data'
        }
    });

    return {
        type: UPDATE_ROOM,
        payload: request
    };
}

export function updateRoomSuccess(activeRoom) {
    return {
        type: UPDATE_ROOM_SUCCESS,
        payload: activeRoom
    };
}

export function updateRoomFailure(error) {
    return {
        type: UPDATE_ROOM_FAILURE,
        payload: error
    };
}

export function deleteRoom(id, tokenFromStorage) {

    const request = axios({
        method: 'delete',
        url: `${ROOT_URL}/rooms/?id=${id}&token=${tokenFromStorage}`
    });

    return {
        type: DELETE_ROOM,
        payload: request
    };
}

export function deleteRoomSuccess(activeRoom) {
    return {
        type: DELETE_ROOM_SUCCESS,
        payload: activeRoom
    };
}

export function deleteRoomFailure(error) {
    return {
        type: DELETE_ROOM_FAILURE,
        payload: error
    };
}

export function resetDeletedRoom() {
    return {
        type: RESET_DELETED_ROOM
    }
}

export function uploadRoomPhotos(id, props, tokenFromStorage) {

    const request = axios({
        method: 'post',
        data: props,
        url: `${ROOT_URL}/rooms/?photos=${id}&token=${tokenFromStorage}`,
        // headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded, multipart/form-data'
        // }
    });

    return {
        type: UPLOAD_ROOM_PHOTOS,
        payload: request
    };
}

export function uploadRoomPhotosSuccess(activeRoom) {
    return {
        type: UPLOAD_ROOM_PHOTOS_SUCCESS,
        payload: activeRoom
    };
}

export function uploadRoomPhotosFailure(error) {
    return {
        type: UPLOAD_ROOM_PHOTOS_FAILURE,
        payload: error
    };
}


export function deleteRoomPhoto(id, photoId, tokenFromStorage) {

    const request = axios({
        method: 'delete',
        // data: props,
        url: `${ROOT_URL}/rooms/?photos=${id}&photo=${photoId}&token=${tokenFromStorage}`,
        // headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded, multipart/form-data'
        // }
    });

    return {
        type: DELETE_ROOM_PHOTO,
        payload: request
    };
}

export function deleteRoomPhotoSuccess(activeRoom) {
    return {
        type: DELETE_ROOM_PHOTO_SUCCESS,
        payload: activeRoom
    };
}

export function deleteRoomPhotoFailure(error) {
    return {
        type: DELETE_ROOM_PHOTO_FAILURE,
        payload: error
    };
}

export function updateRoomsCalendar(props, tokenFromStorage) {

    const request = axios({
        method: 'post',
        data: props,
        url: `${ROOT_URL}/rooms/?updateCalendar=1&token=${tokenFromStorage}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded, multipart/form-data'
        }
    });

    return {
        type: UPDATE_ROOMS_CALENDAR,
        payload: request
    };
}

export function updateRoomsCalendarSuccess(activeRoom) {
    return {
        type: UPDATE_ROOMS_CALENDAR_SUCCESS,
        payload: activeRoom
    };
}

export function updateRoomsCalendarFailure(error) {
    return {
        type: UPDATE_ROOMS_CALENDAR_FAILURE,
        payload: error
    };
}

export function updateRoomsCalendarByPeriod(props, tokenFromStorage) {

    const request = axios({
        method: 'post',
        data: props,
        url: `${ROOT_URL}/rooms/?updateCalendarByPeriod=1&token=${tokenFromStorage}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded, multipart/form-data'
        }
    });

    return {
        type: UPDATE_ROOMS_CALENDAR_BY_PERIOD,
        payload: request
    };
}

export function updateRoomsCalendarByWeekdays(props, tokenFromStorage) {

    const request = axios({
        method: 'post',
        data: props,
        url: `${ROOT_URL}/rooms/?updateCalendarWeekdays=1&token=${tokenFromStorage}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded, multipart/form-data'
        }
    });

    return {
        type: UPDATE_ROOMS_CALENDAR,
        payload: request
    };
}

export function updateRoomsCalendarByPeriodSuccess(activeRoom) {
    return {
        type: UPDATE_ROOMS_CALENDAR_BY_PERIOD_SUCCESS,
        payload: activeRoom
    };
}

export function updateRoomsCalendarByPeriodFailure(error) {
    return {
        type: UPDATE_ROOMS_CALENDAR_BY_PERIOD_FAILURE,
        payload: error
    };
}

export function changeRoomsCalendarType(id,values,tokenFromStorage) {
    const request = axios({
        method:'post',
        data:values,
        url: `${ROOT_URL}/rooms/?changeCalendar=${id}&token=${tokenFromStorage}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded, multipart/form-data'
        }
    });

    return {
        type: CHANGE_ROOMS_CALENDAR_TYPE,
        payload: request
    }
}
export function changeRoomsCalendarTypeSuccess(res) {
    return {
        type: UPDATE_ROOMS_CALENDAR_BY_PERIOD_SUCCESS,
        payload: res
    }
}
export function changeRoomsCalendarTypeFailure(error) {
    return {
        type: UPDATE_ROOMS_CALENDAR_BY_PERIOD_FAILURE,
        payload: error
    }
}