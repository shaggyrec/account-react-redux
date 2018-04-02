import {connect} from 'react-redux'
import {reset} from 'redux-form';
import ObjectBooking from './ObjectBooking'
import {fetchObject, fetchObjectSuccess, fetchObjectFailure} from '../objectmain/actions';
import {
    fetchOrders,
    fetchOrdersSuccess,
    fetchOrdersFailure,
    fetchFormResult,
    fetchFormResultSuccess,
    fetchFormResultFailure,
    fetchOrderStatusList,
    fetchOrderStatusListFailure,
    fetchOrderStatusListSuccess,
    setOrderStatus,
    setOrderStatusFailure,
    setOrderStatusSuccess,
    cleanOrders,
    updateOrderStatus,
    notify
} from './actions';
function mapStateToProps(globalState, ownProps) {
    //console.log(globalState);
    let paymentType = false;
    if (globalState.activeObject && globalState.activeObject.object && globalState.activeObject.object.PROPS && globalState.activeObject.object.PROPS.PAYMENT_TYPE) {
        paymentType = globalState.activeObject.object.PROPS.PAYMENT_TYPE;
    }
    return {
        activeObject: globalState.activeObject,
        objectId: ownProps.objectId,
        orders: globalState.booking.orders,
        statusList: globalState.booking && globalState.booking.statusList,
        paymentType: paymentType
        //initialValues: {}
    };
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        fetchObject: (id, token) => {
            dispatch(updateOrderStatus(id, token))
            dispatch(fetchObject(id, token))
                .then((result) => {
                    // Note: Error's "data" is in result.payload.response.data (inside "response")
                    // success's "data" is in result.payload.data
                    if (result.payload.response && result.payload.response.status !== 200) {
                        dispatch(fetchObjectFailure(result.payload.response.data));
                    } else {
                        dispatch(fetchObjectSuccess(result.payload.data));
                        dispatch(fetchOrders(id, {LIMIT: ownProps.limit}, token))
                            .then((result) => {
                                // Note: Error's "data" is in result.payload.response.data (inside "response")
                                // success's "data" is in result.payload.data
                                if (result.payload.response && result.payload.response.status !== 200) {
                                    dispatch(fetchOrderStatusListFailure(result.payload.response.data));
                                } else {
                                    dispatch(fetchOrdersSuccess(result.payload.data))
                                    let paymentType = 'percent';
                                    if (result.payload.data.PROPS && result.payload.data.PROPS.PAYMENT_TYPE) {
                                        paymentType = result.payload.data.PROPS.PAYMENT_TYPE.VALUE_XML_ID;
                                    }
                                    if (paymentType == 'percent') {
                                        dispatch(fetchOrderStatusList(token))
                                            .then((result) => {
                                                // Note: Error's "data" is in result.payload.response.data (inside "response")
                                                // success's "data" is in result.payload.data
                                                if (result.payload.response && result.payload.response.status !== 200) {
                                                    dispatch(fetchOrderStatusListFailure(result.payload.response.data));
                                                } else {
                                                    dispatch(fetchOrderStatusListSuccess(result.payload.data))
                                                }
                                            })
                                    }
                                }
                            })

                    }
                })
        },
        fetchFormResults: (id, token) => {
            dispatch(fetchFormResult(id, {LIMIT: ownProps.limit}, token))
                .then((result) => {
                    // Note: Error's "data" is in result.payload.response.data (inside "response")
                    // success's "data" is in result.payload.data
                    if (result.payload.response && result.payload.response.status !== 200) {
                        dispatch(fetchFormResultFailure(result.payload.response.data));
                    } else {
                        dispatch(fetchFormResultSuccess(result.payload.data))
                    }
                })
        },
        fetchOrders: (id, token, bUpdateStatuses) => {
            if (bUpdateStatuses) {
                dispatch(updateOrderStatus(id, token))
            }
            dispatch(fetchOrders(id, {LIMIT: ownProps.limit}, token))
                .then((result) => {
                    // Note: Error's "data" is in result.payload.response.data (inside "response")
                    // success's "data" is in result.payload.data
                    if (result.payload.response && result.payload.response.status !== 200) {
                        dispatch(fetchOrdersFailure(result.payload.response.data));
                    } else {
                        dispatch(fetchOrdersSuccess(result.payload.data))
                    }
                })
            dispatch(fetchOrderStatusList(token))
                .then((result) => {
                    // Note: Error's "data" is in result.payload.response.data (inside "response")
                    // success's "data" is in result.payload.data
                    if (result.payload.response && result.payload.response.status !== 200) {
                        dispatch(fetchOrderStatusListFailure(result.payload.response.data));
                    } else {
                        dispatch(fetchOrderStatusListSuccess(result.payload.data))
                    }
                })
        },
        setFilter: (values) => {
            let token = localStorage.getItem('jwtToken');
            if (!token || token === '') {
                //if there is no token, dont bother,
                var data = {data: {message: 'Please Sign In'}}; //axios like error
                //dispatch(updateObjectPropsGroupFailure(data));
                // throw new SubmissionError(data);
            }
            values.LIMIT = ownProps.limit;
            dispatch(fetchOrders(ownProps.objectId, values, token))
                .then((result) => {
                    // Note: Error's "data" is in result.payload.response.data (inside "response")
                    // success's "data" is in result.payload.data
                    if (result.payload.response && result.payload.response.status !== 200) {
                        dispatch(fetchOrdersFailure(result.payload.response.data));
                    } else {
                        dispatch(fetchOrdersSuccess(result.payload.data))
                    }
                });
            // console.log(values);
        },
        resetFilter: () => {
            dispatch(reset('ObjectBooking'));
        },
        setOrderStatus: (orderId, status, answer, token) => {
            dispatch(setOrderStatus(orderId, status, answer, token))
                .then((result) => {
                    // Note: Error's "data" is in result.payload.response.data (inside "response")
                    // success's "data" is in result.payload.data
                    if (result.payload.response && result.payload.response.status !== 200) {
                        dispatch(setOrderStatusFailure(result.payload.data))
                    } else {
                        dispatch(setOrderStatusSuccess(result.payload.data));
                        dispatch(updateOrderStatus(ownProps.objectId, token))
                        dispatch(fetchOrders(ownProps.objectId, {LIMIT: ownProps.limit}, token))
                            .then((result) => {
                                // Note: Error's "data" is in result.payload.response.data (inside "response")
                                // success's "data" is in result.payload.data
                                if (result.payload.response && result.payload.response.status !== 200) {
                                    dispatch(fetchOrdersFailure(result.payload.response.data));
                                } else {
                                    dispatch(fetchOrdersSuccess(result.payload.data))
                                }
                            })
                    }
                })
        },
        cleanOrders: () => {
            dispatch(cleanOrders())
        },
        notify: (msg) => {
            let token = localStorage.getItem('jwtToken');
            dispatch(notify(msg, 'message', token))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ObjectBooking);