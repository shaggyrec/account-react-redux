import React, {Component} from 'react'
import HeaderContainer from '../components/header/HeaderContainer'
import PropTypes from 'prop-types'
import ObjectHowToGetHere from '../components/howToGetHere/ObjectHowToGetHereContainer'
import Footer from "../components/footer/footer"
import Notifications from '../components/objectmain/NotificationsContainer'

class ObjectHowToGetHerePage extends Component {
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
                            <ObjectHowToGetHere id={this.props.match.params.id}/>
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


export default ObjectHowToGetHerePage