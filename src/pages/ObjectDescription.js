import React, { Component } from 'react'
import PropTypes from 'prop-types'
import HeaderContainer from '../components/header/HeaderContainer'
import ObjectDesc from '../components/objectmain/ObjectDescContainer'
import Footer from "../components/footer/footer"
// import ValidateEmailAlertContainer from '../containers/ValidateEmailAlertContainer'

class ObjectDescription extends Component {
    static contextTypes = {
        router: PropTypes.object
    }
    render() {

        return (
            <div className='fixed-sn'>
                <HeaderContainer/>
                <main>
                    <ObjectDesc id={this.props.match.params.id}/>
                </main>
                <Footer />
            </div>
        )
    }
}


export default ObjectDescription