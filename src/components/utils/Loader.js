import React, { Component } from 'react';
import PropTypes from 'prop-types';



class Loader extends Component {
    static contextTypes = {
        router: PropTypes.object
    };

    componentWillUnmount() {
        //Important! If your component is navigating based on some global state(from say componentWillReceiveProps)
        //always reset that global state back to null when you REMOUNT
        //this.props.resetMe();
    }
    randomAnimation(){
        const anims = ['bounce',
            'flash',
            'pulse',
            'rubberBand',
            'shake',
            'headShake',
            'swing',
            'tada',
            'wobble',
            'jello',
            'flip'
        ]
        return anims[Math.floor(Math.random() * anims.length)]
    }
    render() {
        const {loading} = this.props
        if(loading) {
            return (
                <div className="loader d-flex flex-column justify-content-center align-items-center">
                    <div className={`loader__image animated ${this.randomAnimation()} infinite`}></div>
                </div>
            );
        }else{
            return <div/>
        }
    }
}

export default Loader