import React, { Component } from 'react'
import PropTypes from 'prop-types'
import HeaderContainer from '../components/header/HeaderContainer'
import ObjectPhotos from '../components/objectmain/ObjectPhotosContainer'
import Footer from "../components/footer/footer"
import Notifications from '../components/objectmain/NotificationsContainer'
// import ValidateEmailAlertContainer from '../containers/ValidateEmailAlertContainer'

class ObjectBasic extends Component {
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
                            <ObjectPhotos id={this.props.match.params.id}/>
                        </div>
                        <div className="col-md-3 mt-1">
                            <Notifications/>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }
}


export default ObjectBasic;