import React, {Component} from 'react';
import Header from '../components/header/HeaderContainer';
import ObjectNewFormContainer from '../components/newObject/ObjectNewFormContainer'
import Footer from '../components/footer/footer';

class ObjectNew extends Component {
    render() {
        return (
            <div className='fixed-sn'>
                <Header />
                <main>
                    <ObjectNewFormContainer/>
                </main>
                <Footer/>
            </div>
        )
    }
}


export default ObjectNew;