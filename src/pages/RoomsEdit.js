import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Header from '../components/header/HeaderContainer'
import RoomsEditForm from '../components/rooms/RoomsEditFormContainer'
import Footer from "../components/footer/footer"
import Notifications from '../components/objectmain/NotificationsContainer'
// import ValidateEmailAlertContainer from '../containers/ValidateEmailAlertContainer'

class RoomsNew extends Component {
    static contextTypes = {
        router: PropTypes.object
    }

    render() {

        return (
            <div className='fixed-sn'>
                <Header/>
                <main>
                    <div className="row">
                        <div className="col-md-9">
                            <RoomsEditForm object={this.props.match.params.object} id={this.props.match.params.id}/>
                        </div>
                        <div className="col-md-3 mt-5">
                            <Notifications/>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }
}


export default RoomsNew;