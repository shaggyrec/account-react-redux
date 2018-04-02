import React, { Component } from 'react'
import Header from '../components/header/HeaderContainer'
import Faq from '../components/help/FaqContainer'
import Footer from '../components/footer/footer';

class FaqPage extends Component {
    render() {

        return (
            <div className='fixed-sn'>
                <Header />
                <main>
                    <Faq />
                </main>
                <Footer/>
            </div>
        )
    }
}


export default FaqPage;