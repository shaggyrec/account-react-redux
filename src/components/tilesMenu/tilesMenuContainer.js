import React, { Component } from 'react'
import { connect } from 'react-redux'
import TilesMenu from './tilesMenu'



function mapStateToProps(state) {
    return {
        // deletedPost: state.posts.deletedPost,
        // authenticatedUser: state.user.status === 'authenticated' ? state.user.user : null,
        // user: state.user,
        activeObject: state.activeObject && state.activeObject.object
    };
}


export default connect(mapStateToProps)(TilesMenu);