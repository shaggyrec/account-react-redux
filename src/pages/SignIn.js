import React, { Component } from 'react';
import HeaderContainer from '../components/header/HeaderContainer';
import SignInFormContainer from '../components/user/SignInFormContainer';
import Footer from '../components/footer/footer';

class PostsNew extends Component {
    render() {
        return (
            <div>
            <div>
                <HeaderContainer type='no_left'/>
                <main>
                    <SignInFormContainer />
                </main>
                <Footer />
            </div>
            </div>
        );
    }
}


export default PostsNew;