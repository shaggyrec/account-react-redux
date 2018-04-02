import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Header from '../components/header/HeaderContainer'
import ObjectMain from '../components/objectmain/ObjectMainContainer'
import Notifications from '../components/objectmain/NotificationsContainer'
import Footer from "../components/footer/footer";
// import ValidateEmailAlertContainer from '../containers/ValidateEmailAlertContainer'

class ObjectIndex extends Component {
    static contextTypes = {
        router: PropTypes.object
    }
    render() {

            return (
                <div className='fixed-sn'>
                    <Header />
                    <main>
                        <div className="row">
                            <div className="col-md-9">
                                <ObjectMain id={this.props.match.params.id}/>
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


export default ObjectIndex;