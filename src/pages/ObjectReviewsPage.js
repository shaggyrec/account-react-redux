import React, { Component } from 'react'
import Header from '../components/header/HeaderContainer'
import ObjectReviewsList from '../components/objectmain/ObjectReviewsListContainer'
import Footer from '../components/footer/footer';
import Notifications from '../components/objectmain/NotificationsContainer'
// import ValidateEmailAlertContainer from '../containers/ValidateEmailAlertContainer'

class Index extends Component {
    render() {

        return (
            <div className='fixed-sn'>
                <Header />
                <main>
                    <div className="row">
                        <div className="col-md-9">
                            <ObjectReviewsList id={this.props.match.params.object}/>
                        </div>
                        <div className="col-md-3 mt-1">
                            <Notifications/>
                        </div>
                    </div>
                </main>
                <Footer/>
            </div>
        )
    }
}


export default Index;