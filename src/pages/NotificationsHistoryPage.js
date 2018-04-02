import React, {Component} from 'react'
import PropTypes from 'prop-types'
import HeaderContainer from '../components/header/HeaderContainer'
import Footer from "../components/footer/footer"
import NotificationsHistory from '../components/notificationsHistory/NotificationsContainer'
import Notifications from '../components/objectmain/NotificationsContainer'

class NotificationsHistoryPage extends Component {
    static contextTypes = {
        router: PropTypes.object
    }

    render() {

        return (
            <div className='fixed-sn'>
                <HeaderContainer/>
                <main>
                    <div className="row">
                        <div className="col-md-9">
                            <NotificationsHistory/>
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


export default NotificationsHistoryPage;