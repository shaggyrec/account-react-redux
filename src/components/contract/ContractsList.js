import React, {Component, PureComponent} from 'react'
import PropTypes from  'prop-types'
import {Link} from 'react-router-dom'
import Error from  '../utils/Error'
import Loader from '../utils/Loader'
import SearchInput from '../utils/SearchInput'

class ObjectsList extends Component {
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
    renderContractStage(stage){
        if(stage === 'Y') {
            return <span className="badge badge-pill success-color">Договор действует</span>
        }else if(stage === 'P') {
            return <span className="badge badge-pill purple">Мы составляем договор</span>
        }else if(stage === 'S'){
            return <span className="badge badge-pill orange">Вам нужно согласиться с условиями договора</span>
        }else{
            return (
                <span className="badge badge-pill red">Договор не заключен</span>
            )
        }
    }
    renderObjects(objects) {
        if (objects && objects.length > 0) {
            return objects.map((object) => {
                return (
                    <Link to={'/lk/' + object.ID + '/contract'} key={object.ID}
                          className="list-group-item list-group-item-action justify-content-between">
                        <div>
                            <h4 className="list-group-item-heading" dangerouslySetInnerHTML={{__html: object.NAME}}/>
                            {this.renderContractStage(object.PROPERTY_CONTRACT_STAGE_VALUE)}
                        </div>
                        <span>id: {object.ID}</span>
                    </Link>
                );
            });
        } else {
            return (<div><h3>Не найдено объектов</h3></div>)
        }
    }
    renderSearch(){
        if(this.props.user.group == 'admin') {
            const { fetchObjects, searchTerm} = this.props
            return(
                <SearchInput
                    term={searchTerm}
                    label="Начните вводить название"
                    onchange={fetchObjects}
                />
            )
        }else{
            return (<div className="pageTitle"><h3>Ваши договоры</h3><hr/></div>)
        }
    }
    render() {
        const {objects, loading, error } = this.props.objects
        document.title = 'Договоры';
        if (loading) {
            return <Loader loading={true}/>
        } else if (error) {
            return <Error error={error}/>
        } else {
            return (
                <div className="container-fluid">
                    {this.renderSearch()}
                    {this.renderObjects(objects)}
                </div>
            );
        }
    }
}


export default ObjectsList;