import React, { Component } from 'react';
import HeaderContainer from '../components/header/HeaderContainer';
import SignUpFormContainer from '../components/user/SignUpFormContainer'
import Footer from '../components/footer/footer';

class SignUp extends Component {
    render() {
        return (
            <div>
                <HeaderContainer type='no_left'/>
                <main>
                    <SignUpFormContainer />
                </main>
                <Footer />
            </div>

        );
    }
}


export default SignUp;