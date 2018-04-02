import React, { Component } from 'react'
import PropTypes from 'prop-types'
import HeaderContainer from '../components/header/HeaderContainer'
import ObjectActions from '../components/objectmain/ObjectActionsContainer'
import Footer from "../components/footer/footer"
import Notifications from '../components/objectmain/NotificationsContainer'
// import ValidateEmailAlertContainer from '../containers/ValidateEmailAlertContainer'

class ObjectActionsPage extends Component {
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
                            <ObjectActions id={this.props.match.params.id}/>
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


export default ObjectActionsPage;