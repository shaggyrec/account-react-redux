import React, {Component} from 'react';
import renderField from '../formFields/renderField';
import {Field, FieldArray, reduxForm} from 'redux-form'
import Loader from '../utils/Loader'
import FixedBottomBar from '../utils/FixedBottomBar'

class ObjectHowToGetHere extends Component {
    componentWillMount() {
        let token = localStorage.getItem('jwtToken');
        //  if (!token || token === '') {return;}
        const {object} = this.props.activeObject
        if (!object || +(object.ID) !== +(this.props.objectId)) {
            this.props.fetchObject(this.props.objectId, token);
        }
    }

    renderSubmitButton(submitting) {
        if (submitting) {
            return (
                <button className="btn btn-success" type="submit" disabled={true}>
                    Сохраняю...
                </button>
            )
        } else {
            return (
                <button name="SAVE_ROUTE" type="submit" className="btn red cursor-pointer">
                    Применить
                </button>
            )
        }
    }

    renderField = props => {
        return (
            <div className="col-md-6">
                <label className="control-label active">{props.label}</label>
                <input {...props.input} className="form-control"/>
            </div>
        );
    };

    renderSelectField = props => {
        let options = [];
        // console.log(props.input);
        for (var key in props.all) {
            options.push(
                <option key={props.all[key].value}
                        value={props.all[key].title}>{props.all[key].title}</option>
            );
        }
        return (
            <div className="col-md-6">
                <label className="control-label active">{props.label}</label>
                <select {...props.input} className="form-control">
                    <option value="0" key="0">Нет</option>
                    {options}
                </select>
            </div>
        );
    };

    renderFieldArray = ({fields}) => {
        const startPoint = (<div className="start-point"></div>),
            point = (<div className="point-seperator">
                <div className="mid-point"></div>
            </div>);
        let fromItems = [
            {
                value: 1,
                title: 'Аэропорт'
            },
            {
                value: 2,
                title: 'ж/д вокзал'
            },
            {
                value: 3,
                title: 'Автовокзал'
            },
        ];
        let transportItems = [
            {
                value: 1,
                title: 'автобус'
            },
            {
                value: 2,
                title: 'тролейбус'
            },
            {
                value: 3,
                title: 'маршрутка'
            },
            {
                value: 4,
                title: 'такси'
            },
            {
                value: 5,
                title: 'электричка'
            },
        ];
        return (
            <div className="col-md-12">
                <ul>
                    {fields.map((item, index) => {
                        return (
                            <div key={'path'+index}>
                                {index === 0 ? startPoint : point}
                                <li key={index} className="path-left-border">
                                    <Field component={this.renderSelectField}
                                           name={`${item}.type_obect`} label="От" all={fromItems}
                                    />

                                    <Field component={this.renderField} type="text" name={`${item}.name_obect`}
                                           label="Название"/>

                                    <Field component={this.renderSelectField}
                                           name={`${item}.type_transport`}
                                           all={transportItems}
                                           label="На чем"/>

                                    <Field component={this.renderField} type="text" name={`${item}.nomer_marshruta`}
                                           label="Номер маршрута"/>


                                    <Field component={this.renderField} type="text" name={`${item}.do_ostanovki`}
                                           label="До"/>
                                    <div className="col-md-2">
                                        <button name="REMOVE_PART" type="button" className="btn btn-warning btn-md mt-2"
                                                onClick={() => fields.remove(index)}><i className="fa fa-remove mr-1"></i>Удалить
                                        </button>
                                    </div>
                                </li>
                            </div>
                        );
                    })}
                    <div className="point-seperator">
                        <div className="end-point"></div>
                    </div>
                </ul>
                <button name="ADD_PART" type="button" className="btn btn-primary cursor-pointer"
                        onClick={() => fields.push({
                            type_obect: "",
                            name_obect: "",
                            type_transport: "",
                            nomer_marshruta: "",
                            do_ostanovki: ""
                        })}>Добавить часть маршрута
                </button>
            </div>
        );
    }

    render() {
        const {handleSubmit, submitting, validateAndUpdateObject, initialValues} = this.props;
        const {loading, error, object} = this.props.activeObject;
        let title = "Как добраться";
        if (object && object.NAME) {
            title += " до " + object.NAME;
        }
        document.title = title;
        if (loading) {
            return <Loader loading={loading}/>
        } else if (error) {
            return <div className="alert alert-danger">Error: {error.message}</div>
        }
        if (initialValues && initialValues.hasOwnProperty('KAK_DOBRATSA') && initialValues.KAK_DOBRATSA) {
            return (
                <div className="container-fluid mt-2">
                    <h1 dangerouslySetInnerHTML={{__html: title}}></h1>
                    <form onSubmit={handleSubmit(validateAndUpdateObject)} className="how-to-get-here-form">
                        <div className="row">
                            <FieldArray name="KAK_DOBRATSA" component={this.renderFieldArray}/>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-12">
                                <FixedBottomBar>
                                    {this.renderSubmitButton(submitting)}
                                </FixedBottomBar>
                            </div>
                            <Loader loading={submitting}/>
                        </div>
                    </form>
                </div>
            );
        }
        else {
            return (<div></div>)
        }
    }
}

export default reduxForm({
    form: 'ObjectHowToGetHere',
    enableReinitialize: true
})(ObjectHowToGetHere)