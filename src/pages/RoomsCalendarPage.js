import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Header from '../components/header/HeaderContainer'
import Calendar from '../components/rooms/RoomsCalendarContainer'
import Footer from "../components/footer/footer"
import Notifications from '../components/objectmain/NotificationsContainer'


class RoomsCalendarPage extends Component {
    static contextTypes = {
        router: PropTypes.object
    }

    render() {

        return (
            <div className='fixed-sn'>
                <Header/>
                <main>
                    <Calendar object={this.props.match.params.object} />
                </main>
                <Footer />
            </div>
        )
    }
}


export default RoomsCalendarPage;