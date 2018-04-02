import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { reduxForm, Field, FieldArray, SubmissionError } from 'redux-form'
import renderField from '../formFields/renderField'
import renderTextArea from '../formFields/renderTextArea'
import renderFileInput from '../formFields/renderFileInput'
import renderEditorTextArea from '../formFields/renderEditorTextArea'
import renderFieldCheckBox from '../formFields/renderFieldCheckBox'
import Loader from '../utils/Loader'
import YandexMap from '../utils/Map'
import FixedBottomBar from '../utils/FixedBottomBar'

class ObjectBasicData extends Component {
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
                    Применить
                </button>
            )
        }
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
            document.title = object ? 'Основное ' + object.NAME.replace(/&quot;/g, '\"'): 'Основное объекта'
            return (
                <div className="container-fluid">
                    <form onSubmit={ handleSubmit(validateAndUpdateObject) }>
                        <div className="card  mb-2" style={{background:'#eaeaea'}}>
                            <div className="card-block">
                                <div className="row">
                                    <div className="col-sm-8">
                                        <div className="row">
                                            <div className="col-sm-6 notAllowed">
                                                <div className="labelActive">
                                                    Страна
                                                </div>
                                                {object.IBLOCK_NAME}
                                                <hr/>
                                            </div>
                                            <div className="col-sm-6 notAllowed">
                                                <div className="labelActive">
                                                    Город
                                                </div>
                                                {object.IBLOCK_SECTION_NAME}
                                                <hr/>
                                            </div>
                                            <div className="col-sm-6 notAllowed">
                                                <div className="labelActive">
                                                    Адрес
                                                </div>
                                                    {object.PROPS && object.PROPS.adres.VALUE}
                                                <hr/>
                                            </div>
                                            <div className="col-sm-6 notAllowed">
                                                <div className="labelActive">
                                                    Тип
                                                </div>
                                                {object.PROPS && object.PROPS.katalog.VALUE}
                                                <hr/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <YandexMap center={object.PROPS.karta.VALUE || false}
                                                   controls={[]}
                                                   height={180}
                                        />
                                    </div>
                                </div>
                                <div className="badge badge-default">Для изменения информации адреса необходимо направить запрос на электронную почту подробнее в <Link style={{color:'#fff', textDecoration:'underline'}} to={'/lk/faq'}>частых вопросах</Link></div>
                            </div>
                        </div>
                        <Field
                            name="DETAIL_TEXT"
                            component={ renderTextArea }
                            label="Об объекте"
                            // onBlur={(event) => {
                            //     setTimeout(handleSubmit(validateAndUpdateObject));
                            // }}
                        />
                        <Field
                            name="opis_nomerov"
                            component={ renderTextArea }
                            label="Описание номеров*"
                            // onBlur={(event) => {
                            //     setTimeout(handleSubmit(validateAndUpdateObject));
                            // }}
                        />
                        <FixedBottomBar>
                            {this.renderSubmitButton(submitting)}
                        </FixedBottomBar>
                        <Loader loading={submitting}/>
                    </form>
                </div>
            )
        }else{
            return <div/>
        }
    }
}


export default reduxForm({
    form: 'ObjectDesc', // a unique identifier for this form
    //validate, // <--- validation function given to redux-form
    //asyncValidate,
    enableReinitialize: true
})(ObjectBasicData)