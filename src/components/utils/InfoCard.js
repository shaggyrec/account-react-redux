import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

class InfoCard extends Component {
    static contextTypes = {
        router: PropTypes.object
    };

    componentWillUnmount() {
        //Important! If your component is navigating based on some global state(from say componentWillReceiveProps)
        //always reset that global state back to null when you REMOUNT
        //this.props.resetMe();
    }
    renderBtn(link, linkText, buttonColor){
        linkText = linkText || 'перейти'
        buttonColor = buttonColor || 'red'
        if(link){
            return(
                <Link to={link} className={`btn btn-${buttonColor} ${buttonColor}`}>{linkText}</Link>
            )
        }else{
            return <div />
        }
    }

    render() {
        const {text, type, link, linkText, title, color, buttonColor, className } = this.props
        const typeMessage = !type ? 'warning' : type
        if(title) {
            return (
                <div className={`card ${color} notification ${className}`}>
                    <div className="card-block">
                        <div className="row">
                            <div className="col-10">
                                <h3>{title}</h3>
                                <p className="card-text">{text}</p>
                                {this.renderBtn(link, linkText, buttonColor)}
                            </div>
                            <div className="col-2">
                                <i className={`fa fa-${typeMessage} float-right fontSize3`}></i>
                            </div>
                        </div>
                    </div>
                </div>)
        }else{
            return <div/>
        }
    }
}

export default InfoCard