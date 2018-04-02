import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import './st.css'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

class Notifications extends Component {
    constructor(props) {
        super(props)
        this.closeNotification = this.closeNotification.bind(this)
    }
    componentWillMount(){
        const { socketsConnect , user, socket:{loaded} } = this.props
        if(user && user.channelId && !loaded) {
            socketsConnect(user.channelId)
        }
    }
    closeNotification (index) {
        this.props.deleteMessage(index)
    }
    renderNotifications(messages){
        return messages.map((message, index) =>{
            if(message.link){
                return (
                    <div key={`wsNotification${index}`} className={`wsNotification ${message.type.toLowerCase()}`}>
                        <button type="button" className="close" aria-label="Close" onClick={e => this.closeNotification(index)}>
                            <span aria-hidden="true" className="white-text">&times;</span>
                        </button>
                        <Link className="wsNotification__message" to={message.link}>{message.data}</Link>
                    </div>
                )
            }else{
                return (
                    <div key={`wsNotification${index}`} className={`wsNotification ${message.type.toLowerCase()}`}>
                        <button type="button" className="close" aria-label="Close" onClick={e => this.closeNotification(index)}>
                            <span aria-hidden="true" className="white-text">&times;</span>
                        </button>
                        <div className="wsNotification__message">{message.data}</div>
                    </div>
                )
            }
        })
    }
    render(){
        const { socket } = this.props
        if(socket.messages && socket.messages.length && socket.messages.length > 0) {
            return (
                <div className="wsNotifications">
                    <ReactCSSTransitionGroup
                        transitionName="fade"
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={300}>
                        {this.renderNotifications(socket.messages)}
                    </ReactCSSTransitionGroup>
                </div>
            )
        }else{
            return <div className="wsNotifications"/>
        }
    }
}

export default Notifications