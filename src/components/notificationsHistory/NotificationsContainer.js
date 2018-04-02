import {connect} from 'react-redux'
import NotificationsHistory from './Notifications'
import {fetchNotifications, fetchNotificationsFailure, fetchNotificationsSuccess} from './actions'

function mapStateToProps(globalState, ownProps) {
    return {
        notifications: globalState.notifications && globalState.notifications.notifications
    };
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        fetchNotifications: (id, token) => {
            dispatch(fetchNotifications(id, token))
                .then((result) => {
                    // Note: Error's "data" is in result.payload.response.data (inside "response")
                    // success's "data" is in result.payload.data
                    if (result.payload.response && result.payload.response.status !== 200) {
                        dispatch(fetchNotificationsFailure(result.payload.response.data));
                    } else {
                        dispatch(fetchNotificationsSuccess(result.payload.data))
                    }
                })
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsHistory);