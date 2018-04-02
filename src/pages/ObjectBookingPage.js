import React, {Component} from 'react'
import HeaderContainer from '../components/header/HeaderContainer'
import ObjectBooking from '../components/booking/ObjectBookingContainer'
import PropTypes from 'prop-types'
import Notifications from '../components/objectmain/NotificationsContainer'
import Footer from "../components/footer/footer";

class ObjectBookingPage extends Component {
    static contextTypes = {
        router: PropTypes.object
    }

    render() {
        return (
            <div className='fixed-sn'>
                <HeaderContainer/>
                <main>
                    <ObjectBooking objectId={this.props.match.params.object} mode="full"/>
                </main>
                <Footer />
            </div>
        )
    }
}


export default ObjectBookingPage;