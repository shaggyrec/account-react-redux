import React, {Component} from 'react'
import PropTypes from 'prop-types'
import HeaderContainer from '../components/header/HeaderContainer'
import ObjectChildren from '../components/objectmain/ObjectChildrenContainer'
import Footer from "../components/footer/footer"
import Notifications from '../components/objectmain/NotificationsContainer'
// import ValidateEmailAlertContainer from '../containers/ValidateEmailAlertContainer'

class ObjectChildrenPage extends Component {
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
                            <ObjectChildren
                                id={this.props.match.params.id}
                                groupName="DLYA_DETEY"
                                form="ObjectChildrenGroup"
                            />
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


export default ObjectChildrenPage;