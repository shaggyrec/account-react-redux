import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Error extends Component {
    static contextTypes = {
        router: PropTypes.object
    };

    componentWillUnmount() {
        //Important! If your component is navigating based on some global state(from say componentWillReceiveProps)
        //always reset that global state back to null when you REMOUNT
        //this.props.resetMe();
    }

    render() {
        const {error} = this.props
        if(error && error.message) {
            return <div className="alert alert-danger" dangerouslySetInnerHTML={{__html: error.message}}></div>
        }else{
            return <div/>
        }
    }
}

export default Error