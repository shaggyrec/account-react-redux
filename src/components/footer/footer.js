import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';


class Footer extends Component {
    static contextTypes = {
        router: PropTypes.object
    };

    componentWillUnmount() {
        //Important! If your component is navigating based on some global state(from say componentWillReceiveProps)
        //always reset that global state back to null when you REMOUNT
        //this.props.resetMe();
    }
    renderLinks() {
        return(
            <div>dsad</div>
        )
    }
    render() {
        return (
            <footer className="page-footer elegant-color center-on-small-only">
                <div className="footer-copyright">
                    <div className="container-fluid">
                        © 2018 <a target="_blank" href="https://edem-v-gosti.ru"> Edem-v-Gosti.ru </a>
                    </div>
                </div>

            </footer>
        );
    }
}

export default Footer