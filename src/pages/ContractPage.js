import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Header from '../components/header/HeaderContainer'
import Contract from '../components/contract/ContractContainer'
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
                    <Contract id={this.props.match.params.object}/>
                </main>
                <Footer/>
            </div>
        )
    }
}


export default ContractPage