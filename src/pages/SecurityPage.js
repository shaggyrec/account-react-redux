import React, { Component } from 'react'
import Header from '../components/header/HeaderContainer'
import Security from '../components/user/SecurityContainer'
import Footer from '../components/footer/footer';

class SecurityPage extends Component {
    render() {

        return (
            <div className='fixed-sn'>
                <Header />
                <main>
                    <Security />
                </main>
                <Footer/>
            </div>
        )
    }
}


export default SecurityPage