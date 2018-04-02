import { connect } from 'react-redux'
import { fetchRooms, fetchRoomsSuccess, fetchRoomsFailure,updateRoom,updateRoomSuccess, updateRoomFailure, fetchTypes, fetchTypesSuccess, fetchTypesFailure, resetActiveRoom,
    uploadRoomPhotos, uploadRoomPhotosSuccess, uploadRoomPhotosFailure, deleteRoomPhoto, deleteRoomPhotoSuccess, deleteRoomPhotoFailure,
    updateRoomsCalendar, updateRoomsCalendarSuccess, updateRoomsCalendarFailure,
    updateRoomsCalendarByPeriod, updateRoomsCalendarByPeriodSuccess, updateRoomsCalendarByPeriodFailure,
    changeRoomsCalendarType, changeRoomsCalendarTypeSuccess, changeRoomsCalendarTypeFailure,updateRoomsCalendarByWeekdays} from './actions';
import { fetchObject, fetchObjectSuccess, fetchObjectFailure, resetActiveObject, updateObject, updateObjectSuccess, updateObjectFailure} from '../objectmain/actions';
import RoomsCalendar from './RoomsCalendar'
import { SubmissionError } from 'redux-form'

function mapStateToProps(globalState, ownProps) {
    let prices = {}
    let freeRoomsCount = {}
    let pricesWeekdays = {}
    let pricesPeriods = {}
    if (globalState.rooms.roomsList.roomsList){
        for (let room of globalState.rooms.roomsList.roomsList) {
            if(!room.PROPS){
                continue
            }
            for (let fr in room.PROPS.FREE_ROOMS_COUNT.VALUE) {
                fr = room.PROPS.FREE_ROOMS_COUNT.VALUE[fr]
                if (fr.length !== 0) {
                    freeRoomsCount[`${room.ID}_free_${fr.data_ot}-${fr.data_do}`] = fr.count
                }
            }


            pricesPeriods[room.ID] = []
            for(let priceRow of room.PROPS.PRICE_TABLE.VALUE){
                if(typeof(priceRow) === 'object' &&  priceRow.length !== 0) {
                    let mest = parseInt(priceRow.mest)
                    if(priceRow.mest == 'Ребенок'){
                        mest = 'child'
                    }else if(priceRow.mest == 'Доп. место'){
                        mest = 'dop'
                    }
                    prices[`${room.ID}_${mest}_${priceRow.data_ot}-${priceRow.data_do}`] = priceRow.price
                    if(pricesPeriods[room.ID].indexOf(`${priceRow.data_ot}-${priceRow.data_do}`) === -1) {
                        pricesPeriods[room.ID].push(`${priceRow.data_ot}-${priceRow.data_do}`)
                    }
                }
            }

            for(let priceRow of room.PROPS.PRICE_TABLE_WEEKDAYS.VALUE){
                if(priceRow.length !== 0) {
                    let mest = parseInt(priceRow.mest)
                    if(priceRow.mest == 'Ребенок'){
                        mest = 'child'
                    }else if(priceRow.mest == 'Доп. место'){
                        mest = 'dop'
                    }
                    if(priceRow.weekdays) {
                        pricesWeekdays[`${room.ID}_${mest}_weekdays`] = priceRow.weekdays
                    }
                    if(priceRow.weekend) {
                        pricesWeekdays[`${room.ID}_${mest}_weekend`] = priceRow.weekend
                    }
                    if(priceRow.holidays) {
                        pricesWeekdays[`${room.ID}_${mest}_holidays`] = priceRow.holidays
                    }
                }
            }
        }
    }
    return {
        objectId: ownProps.object,
        activeObject:globalState.activeObject,
        rooms: globalState.rooms.roomsList,
        roomTypes: globalState.rooms.roomTypes,
        prices: prices,
        // pricesList: pricesList,
        pricesWeekdays: pricesWeekdays,
        freeRoomsCount:freeRoomsCount,
        pricesPeriods:pricesPeriods
    }
}
const mapDispatchToProps = (dispatch,ownProps) => {
    return {
        fetchObject: (id, token) => {
            return dispatch(fetchObject(id, token))
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
        changeCalendarType:(type,cb)=>{
            let token = localStorage.getItem('jwtToken');
            if (!token || token === '') {
                //if there is no token, dont bother,
                let data = { data: { message: 'Please Sign In' } }; //axios like error
                dispatch(changeRoomsCalendarTypeFailure(data));
                return
            }

            dispatch(updateObject(ownProps.object, {'calendarType': type}, token))
                .then(result => {
                    // Note: Error's "data" is in result.payload.response.data (inside "response")
                    // success's "data" is in result.payload.data
                    if (result.payload.response && result.payload.response.status !== 200) {
                        dispatch(updateObjectFailure(result.payload.response.data));
                        //throw new SubmissionError(result.payload.response.data);
                        return
                    }
                    //let other components know that everything is fine by updating the redux` state
                    dispatch(updateObjectSuccess(result.payload.data)); //ps: this is same as dispatching RESET_USER_FIELDS
                    cb(type)
                })

        },
        updateRoomsCalendar: (values) => {
            let token = localStorage.getItem('jwtToken');
            if (!token || token === '') {
                //if there is no token, dont bother,
                var data = { data: { message: 'Please Sign In' } }; //axios like error
                dispatch(updateRoomsCalendarFailure(data));
                //throw new SubmissionError(data);
            }
            // if(values.picture){
            let formData = new FormData()
            for(let prop in values){
                if(values[prop]) {
                    formData.append(prop, values[prop])
                }
            }
            values = formData
            // }

            dispatch(updateRoomsCalendar(values, token))
                .then(result => {
                    // Note: Error's "data" is in result.payload.response.data (inside "response")
                    // success's "data" is in result.payload.data
                    if (result.payload.response && result.payload.response.status !== 200) {
                        dispatch(updateRoomsCalendarFailure(result.payload.response.data));
                        return
                        //throw new SubmissionError(result.payload.response.data);
                    }
                    //let other components know that everything is fine by updating the redux` state
                    dispatch(updateRoomsCalendarSuccess(result.payload.data)); //ps: this is same as dispatching RESET_USER_FIELDS
                });
        },
        updateRoomsCalendarByPeriod: (values) => {
            let token = localStorage.getItem('jwtToken');
            if (!token || token === '') {
                //if there is no token, dont bother,
                var data = { data: { message: 'Please Sign In' } }; //axios like error
                dispatch(updateRoomsCalendarByPeriodFailure(data));
                //throw new SubmissionError(data);
            }
            // if(values.picture){

            let formData = new FormData()
            for(let prop in values){
                // if(values[prop]) {
                    formData.append(prop, values[prop])
                // }
            }
            values = formData
            // }

            dispatch(updateRoomsCalendarByPeriod(values, token))
                .then(result => {
                    // Note: Error's "data" is in result.payload.response.data (inside "response")
                    // success's "data" is in result.payload.data
                    if (result.payload.response && result.payload.response.status !== 200) {
                        dispatch(updateRoomsCalendarByPeriodFailure(result.payload.response.data));
                        //throw new SubmissionError(result.payload.response.data);
                    }else {
                        //let other components know that everything is fine by updating the redux` state
                        dispatch(updateRoomsCalendarByPeriodSuccess(result.payload.data)); //ps: this is same as dispatching RESET_USER_FIELDS
                    }
                });
        },
        updateRoomsCalendarByWeekdays: (values) => {
            let token = localStorage.getItem('jwtToken');
            if (!token || token === '') {
                //if there is no token, dont bother,
                var data = { data: { message: 'Please Sign In' } }; //axios like error
                dispatch(updateRoomsCalendar(data));
                //throw new SubmissionError(data);
            }
            // if(values.picture){

            let formData = new FormData()
            for(let prop in values){
                // if(values[prop]) {
                formData.append(prop, values[prop])
                // }
            }
            values = formData
            // }

            dispatch(updateRoomsCalendarByWeekdays(values, token))
                .then(result => {
                    // Note: Error's "data" is in result.payload.response.data (inside "response")
                    // success's "data" is in result.payload.data
                    if (result.payload.response && result.payload.response.status !== 200) {
                        dispatch(updateRoomsCalendarFailure(result.payload.response.data));
                        //throw new SubmissionError(result.payload.response.data);
                    }else {
                        //let other components know that everything is fine by updating the redux` state
                        dispatch(updateRoomsCalendarSuccess(result.payload.data)); //ps: this is same as dispatching RESET_USER_FIELDS
                    }
                });
        },
        updateRoom: (id,values) => {
            let token = localStorage.getItem('jwtToken');
            if (!token || token === '') {
                //if there is no token, dont bother,
                var data = { data: { message: 'Please Sign In' } }; //axios like error
                dispatch(updateRoomFailure(data));
                //throw new SubmissionError(data);
            }
            // if(values.picture){
            let formData = new FormData()
            for(let prop in values){
               if(values[prop] && typeof(values[prop]) === 'object') {
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
            dispatch(updateRoom(id, values, token))
                .then(result => {
                    // Note: Error's "data" is in result.payload.response.data (inside "response")
                    // success's "data" is in result.payload.data
                    if (result.payload.response && result.payload.response.status !== 200) {
                        dispatch(updateRoomFailure(result.payload.response.data));
                        throw new SubmissionError(result.payload.response.data);
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
        resetMe: () => {
            //clean up both activePost(currrently open) and deletedPost(open and being deleted) states
            dispatch(resetActiveRoom());
            //dispatch(resetDeletedPost());
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(RoomsCalendar);