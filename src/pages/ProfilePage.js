import React, { Component } from 'react'
import Header from '../components/header/HeaderContainer'
import Profile from '../components/user/ProfileContainer'
import Footer from '../components/footer/footer';

class ProfilePage extends Component {
    render() {

        return (
            <div className='fixed-sn'>
                <Header />
                <main>
                    <Profile />
                </main>
                <Footer/>
            </div>
        )
    }
}


export default ProfilePage;