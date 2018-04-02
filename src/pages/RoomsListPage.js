import React, { Component } from 'react'
import HeaderContainer from '../components/header/HeaderContainer'
import RoomsList from '../components/rooms/RoomsListContainer'
import Footer from '../components/footer/footer';

class RoomsListPage extends Component {
    render() {

        return (
            <div className='fixed-sn'>
                <HeaderContainer type='object'/>
                <main>
                    <RoomsList object={this.props.match.params.object}/>
                </main>
                <Footer/>
            </div>
        )
    }
}


export default RoomsListPage