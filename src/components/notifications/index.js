import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as socketActions from '../../middleware/socketMiddleware/module'
import Notifications from './Notifications'

function mapStateToProps(state) {
    return {
        user: state.user.status === 'authenticated' ? state.user.user : null,
        socket: state.socket
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
     return {
         socketsConnect: (channelId) => {
                dispatch(socketActions.socketsConnect(channelId))
         },
         deleteMessage(index){
             dispatch( socketActions.socketsMessageDelete(index) )
         }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Notifications);