import React, { Component } from 'react'
import PropTypes from  'prop-types'
import { Link } from 'react-router-dom'
import Error from  '../utils/Error'
import Loader from '../utils/Loader'
import ReactTooltip from 'react-tooltip'

class RoomsList extends Component {
    static contextTypes = {
        router: PropTypes.object
    }

    componentWillMount() {
        let token = localStorage.getItem('jwtToken');
        this.props.resetMe()
        const { object } = this.props.activeObject;
        if( !object || +(object.ID) !== +(this.props.objectId)) {
            this.props.fetchObject(this.props.objectId, token);
        }else if(object.PROPS.NOMERA){
            this.props.fetchRooms(object.PROPS.NOMERA.VALUE,token)
        }
    }

    componentWillUpdate(nextProps, nextState){

    }


    componentWillReceiveProps(nextProps) {
        if(nextProps.deletedRoom.error && nextProps.deletedRoom.error.message) {//delete failure
            alert(nextProps.deletedRoom.error.message || 'Could not delete. Please try again.')
        } else if(nextProps.deletedRoom.room && !nextProps.deletedRoom.error) {//delete success
            let token = localStorage.getItem('jwtToken');
            this.props.fetchObject(this.props.objectId,token)
            this.props.resetMe()
        }
    }
    renderStatus(isActive,id){
        return <i className={`fa fa-circle${isActive ? ' green-text' : '-o red-text'}`} data-tip data-for={`${id}_hint`}><ReactTooltip  id={`${id}_hint`}>{isActive ? 'Активен' : 'Неактивен'}</ReactTooltip></i>
    }
    renderRooms(rooms) {
        if(rooms && rooms.length>0) {
            return rooms.map((room) => {
                return (
                    <div key={room.ID} className="list-group-item list-group-item-action align-items-center pb-0 pt-0 pl-0 pr-0">
                        <Link className='d-flex flex-nowrap align-items-center'  style={{flexGrow:'12', padding: '.75rem 1.25rem'}}  to={'/lk/'+ this.props.objectId +'/rooms/' + room.ID} >
                                {this.renderStatus(room.ACTIVE === 'Y', room.ID)}
                                <h3 className="list-group-item-heading ml-2 mb-0">{room.NAME}</h3>
                        </Link>
                        <div>
                            <span className={`badge ${room.ACTIVE === 'Y' ? 'badge-success' : 'badge-danger'}`}>{room.ACTIVE === 'Y' ? 'активен' : 'неактивен'}</span>
                            <button type="button" className="btn btn-sm red" title="удалить номер" data-tip data-for={`${room.ID}_del`} onClick={() => {this.props.deleteRoom(room.ID)}}><i className="fa fa-trash" aria-hidden="true"></i></button>
                            <ReactTooltip  id={`${room.ID}_del`}>Удалить номер</ReactTooltip>
                        </div>
                    </div>
                );
            });
        }else{
            return (<div><h3>Нет номеров у объекта</h3></div>)
        }
    }
    renderError(error) {
        if(error) {
            return <Error error={error}/>
        }
    }

    render() {
        const { roomsList, loading, error } = this.props.rooms;
        document.title = 'Номера'
        if(loading) {
            return <Loader loading={true}/>
        } else {
            return (
                <div className="container-fluid">
                    <div className="pageTitle"><h1>Номера</h1></div>
                    {this.renderError(error)}
                    {this.renderRooms(roomsList)}
                    <div className="mt-2">
                        <Link to={'/lk/'+ this.props.objectId +'/rooms/new'} className="btn red">Создать новый номер</Link>
                    </div>
                </div>
            );
        }
    }
}


export default RoomsList;