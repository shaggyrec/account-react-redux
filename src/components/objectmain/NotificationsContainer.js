import React, { Component } from 'react';
import { connect } from 'react-redux';
import Notifications from './Notifications'



function mapStateToProps(state) {
    return {
        authenticatedUser: state.user.status === 'authenticated' ? state.user.user : null,
        user: state.user.user,
        activeObject: state.activeObject && state.activeObject.object,
        activeObjectId: state.activeObject.object && state.activeObject.object.ID,
        activeRoom: state.rooms.activeRoom && state.rooms.activeRoom.room
    };
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        resetMe: () =>{
            //dispatch(resetDeletedPost());
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Notifications);