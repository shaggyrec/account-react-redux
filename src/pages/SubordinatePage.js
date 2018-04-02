import React, { Component } from 'react'
import Header from '../components/header/HeaderContainer'
import Subordinate from '../components/subordinate/SubordinateContainer'
import Footer from '../components/footer/footer';

class ProfilePage extends Component {
    render() {

        return (
            <div className='fixed-sn'>
                <Header />
                <main>
                    <Subordinate />
                </main>
                <Footer/>
            </div>
        )
    }
}


export default ProfilePage;