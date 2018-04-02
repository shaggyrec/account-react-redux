import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Header from '../components/header/HeaderContainer'
import RoomsAddForm from '../components/rooms/RoomsAddFormContainer'
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
                            <RoomsAddForm object={this.props.match.params.object}/>
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