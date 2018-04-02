import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { reduxForm, Field, FieldArray, SubmissionError } from 'redux-form'
import renderField from '../formFields/renderField'
import TilesMenu from '../tilesMenu/tilesMenuContainer'
import renderTextArea from '../formFields/renderTextArea'
import renderFileInput from '../formFields/renderFileInput'
import renderEditorTextArea from '../formFields/renderEditorTextArea'
import renderFieldCheckBox from '../formFields/renderFieldCheckBox'
import Loader from '../utils/Loader'
import YandexMap from '../utils/Map'
import FixedBottomBar from '../utils/FixedBottomBar'

class ObjectContacts extends Component {
    componentWillMount() {
        let token = localStorage.getItem('jwtToken');
        //if (!token || token === '') {return;}
        const { object } = this.props.activeObject
        if( !object || +(object.ID) !== +(this.props.objectId)) {
            this.props.fetchObject(this.props.objectId, token);
        }
    }

    renderSubmitButton(submitting){
        if(submitting){
            return(
                <button className="btn btn-success" type="submit" disabled={true}>
                    Сохраняю...
                </button>
            )
        }else{
            return(
                <button className="btn red" type="submit">
                    Сохранить
                </button>
            )
        }
    }
    renderPhonesArray = ({fields}) => {
        const { array: { push }, handleSubmit, pristine, reset, submitting } = this.props
        return(
            <ul className="mb-2">
                {fields.map((field, fieldIndex) =>
                    <li key={fieldIndex} className="row">
                        <div className="col-sm-5">
                            <Field name={`${field}.tel`} component={renderField} type="text" label="Телефон" />
                        </div>
                        <div className="col-sm-5">
                            <Field name={`${field}.name`} component={renderField} type="text" label="Имя"/>
                        </div>
                        <div className="col-sm-2 d-flex align-items-center justify-content-end">
                            <button
                                className="btn red btn-sm"
                                type="button"
                                title="Удалить номер телефона"
                                onClick={() => fields.remove(fieldIndex)}>
                                <i className="fa fa-trash" aria-hidden="true"/>
                            </button>
                        </div>
                    </li>
                )}
                <li className="mb-1">
                    <button className="btn btn-md red" type="button" onClick={() => push('telefon1', {})}><i className="fa fa-plus"/> Добавить телефон</button>
                </li>
            </ul>
        )
    }

    render() {
        const {handleSubmit, submitting, validateAndUpdateObject } = this.props
        const { object, loading, error } = this.props.activeObject;
        if(loading) {
            return <Loader loading={loading}/>
        } else if(error) {
            return <div className="alert alert-danger">Error: {error.message}</div>
        }
        if(object) {
            document.title = object ? 'Контакты ' + object.NAME.replace(/&quot;/g, '\"'): 'Контакты объекта'
            return (
                <div className="container-fluid">
                    <form onSubmit={ handleSubmit(validateAndUpdateObject) }>
                        {object.PROPS.PAYMENT_TYPE.VALUE_XML_ID === 'subscriber' ? <FieldArray name="telefon1" component={this.renderPhonesArray}/> : ''}
                        <Field
                            name="telefon3"
                            component={ renderField }
                            label="Телефон для смс"
                            type="text"
                        />
                        <div style={{marginTop:'-1.6rem'}}>
                            <span className="badge badge-default">(укажите телефон для получения смс-уведомлений о новых бронированиях, если нужны смс-уведомления)</span>
                        </div>
                        {/*<Field*/}
                            {/*name="SAIT"*/}
                            {/*component={ renderField }*/}
                            {/*label="Сайт"*/}
                            {/*type="text"*/}
                        {/*/>*/}
                        {object.PROPS.PAYMENT_TYPE.VALUE_XML_ID === 'subscriber' ?
                             <Field
                            name="SKYPE"
                            component={ renderField }
                            label="Скайп"
                            type="text"
                            /> : ''
                        }
                        <Field
                            name="mail1"
                            component={ renderField }
                            label="e-mail для заявок"
                            type="text"
                        />
                        <Field
                            name="mail2"
                            component={ renderField }
                            label="e-mail для отзывов"
                            type="text"
                        />
                        <Field
                            name="mail3"
                            component={ renderField }
                            label="e-mail для бухгалтерии"
                            type="text"
                        />
                        {object.PROPS.PAYMENT_TYPE.VALUE_XML_ID === 'subscriber' ?
                            <Field
                                name="NO_SHOW_EMAIL"
                                id="NO_SHOW_EMAIL"
                                component={ renderFieldCheckBox }
                                label="Не показывать email"
                                type='checkbox'
                                onBlur={(event) => {
                                    setTimeout(handleSubmit(validateAndUpdateObject));
                                }}
                            /> : ''
                        }
                        <FixedBottomBar>
                            {this.renderSubmitButton(submitting)}
                        </FixedBottomBar>
                    </form>
                    <Loader loading={submitting}/>
                </div>
            )
        }else{
            return <div/>
        }
    }
}


export default reduxForm({
    form: 'ObjectContacts', // a unique identifier for this form
    //validate, // <--- validation function given to redux-form
    //asyncValidate,
    enableReinitialize: true
})(ObjectContacts)