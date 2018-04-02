import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Header from '../components/header/HeaderContainer'
import ContractsList from '../components/contract/ContractsListContainer'
import Footer from '../components/footer/footer';

class ContractPage extends Component {
    static contextTypes = {
        router: PropTypes.object
    }
    render() {
        return (
            <div className='fixed-sn'>
                <Header />
                <main>
                    <ContractsList />
                </main>
                <Footer/>
            </div>
        )
    }
}


export default ContractPage