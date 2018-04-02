import React, { Component } from 'react'
import Header from '../components/header/HeaderContainer'
import ObjectsList from '../components/objectsList/ObjectsListContainer'
import Footer from '../components/footer/footer';
// import ValidateEmailAlertContainer from '../containers/ValidateEmailAlertContainer'

class Index extends Component {
    render() {

        return (
            <div className='fixed-sn'>
                <Header />
                <main>
                    <ObjectsList />
                </main>
                <Footer/>
            </div>
        )
    }
}


export default Index;