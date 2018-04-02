import React, { Component } from 'react';
import { connect } from 'react-redux';
//import { fetchPosts, resetDeletedPost, deletePost, deletePostSuccess, deletePostFailure } from '../actions/posts';
import { logoutUser } from '../user/actions'
import Header from './header'



function mapStateToProps(state) {
    return {
        // deletedPost: state.posts.deletedPost,
        authenticatedUser: state.user.status === 'authenticated' ? state.user.user : null,
        // user: state.user,
        activeObject: state.activeObject && state.activeObject.object
    };
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onDeleteClick: (id) => {
            // let token = localStorage.getItem('jwtToken');
            // if (!token || token === '') { //if there is no token, dont bother,
            //     let data = {data: {message: 'Please Sign In'}};//axios like error
            //     dispatch(deletePostFailure(data)); // but let other comps know
            //     return;
            // }
            //
            // dispatch(deletePost(id, token))
            //     .then((response) => {
            //         !response.error ? dispatch(deletePostSuccess(response.payload)) : dispatch(deletePostFailure(response.payload));
            //     });
        },
        resetMe: () =>{
            //dispatch(resetDeletedPost());
        },

        logout: () => {
            dispatch(logoutUser());
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Header);