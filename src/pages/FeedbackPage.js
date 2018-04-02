import React, { Component } from 'react'
import Header from '../components/header/HeaderContainer'
import Feedback from '../components/feedback/FeedbackContainer'
import Footer from '../components/footer/footer';
import Notifications from '../components/objectmain/Notifications'

class FeedbackPage extends Component {
    render() {
        return (

            <div className='fixed-sn'>
                <Header />
                <main>
                    <div className="row">
                        <div className="col-md-9">
                            <Feedback />
                        </div>
                        <div className="col-md-3 mt-5">
                            <Notifications/>
                        </div>
                    </div>
                </main>
                <Footer/>
            </div>
        )
    }
}


export default FeedbackPage;