import React, {Component, PureComponent} from 'react'
import PropTypes from  'prop-types'
import {Link} from 'react-router-dom'
import Error from  '../utils/Error'
import Loader from '../utils/Loader'
import SearchInput from '../utils/SearchInput'
import { reduxForm, Field } from  'redux-form'
import renderFiled from '../formFields/renderField'
import ReactTooltip from 'react-tooltip'

var timeId

class ObjectsList extends PureComponent {
    constructor(props){
        super(props)
    }
    static contextTypes = {
        router: PropTypes.object
    }

    componentWillMount() {
        this.props.resetActiveObject()
        if(this.props.user.group !== 'admin') {
            this.props.fetchObjects()
        }
    }

    componentWillUpdate(nextProps, nextState) {
        // if(nextProps.objects.objects.length === 1) {
        //     this.context.router.history.push(nextProps.objects.objects[0].ID.toString())
        //
    }

    renderStatus(isActive,id){
        return <i className={`fa fa-circle${isActive ? ' green-text' : '-o red-text'}`} data-tip data-for={`${id}_hint`}><ReactTooltip  id={`${id}_hint`}>{isActive ? 'Активен' : 'Неактивен'}</ReactTooltip></i>
    }

    renderObjects(objects) {
        if (objects && objects.length > 0) {
            return objects.map((object) => {
                return (
                    <Link to={'/lk/' + object.ID} key={object.ID}
                          className={`list-group-item list-group-item-action justify-content-between`}>
                        <div className="d-flex flex-nowrap align-items-center">
                            {this.renderStatus(object.ACTIVE === 'Y', object.ID)}
                            <h3 className='list-group-item-heading ml-2 mb-0' dangerouslySetInnerHTML={{__html: object.NAME}}/>
                        </div>
                        <div><span className={`badge ${object.ACTIVE === 'Y' ? 'badge-success' : 'badge-danger'}`}>{object.ACTIVE === 'Y' ? 'активен' : 'неактивен'}</span> <span>id: {object.ID}</span></div>
                    </Link>
                );
            });
        } else {
            return (<div><h3>Не найдено объектов</h3></div>)
        }
    }
    renderSearch(){
        //console.log(this.props.user)
        if(this.props.user.group == 'admin') {
            const { fetchObjects, searchTerm} = this.props
            return(
                <SearchInput onchange={fetchObjects} label="Начните вводить название"/>
            )
        }else{
            return <div />
        }
    }

    render() {
        const {objects, loading, error } = this.props.objects
        document.title = 'Объекты';
        if (loading) {
            return <Loader loading={true}/>
        } else if (error) {
            return <Error error={error}/>
        } else {
            return (
                <div className="container-fluid">
                    <div className="pageTitle"><h1>Выберите объект</h1></div>
                    {this.renderSearch()}
                    {this.renderObjects(objects)}
                    <Link to="/lk/new/object/" className="btn red mt-1">
                        Добавить
                    </Link>
                </div>
            );
        }
    }
}


//export default ObjectsList;
export default reduxForm({
    form: 'ObjectsList', // a unique identifier for this form
    //validate, // <--- validation function given to redux-form
    //asyncValidate,
    enableReinitialize: true
})(ObjectsList)