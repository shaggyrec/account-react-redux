import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { reduxForm, Field, FieldArray, SubmissionError } from 'redux-form'
import renderField from '../formFields/renderField'
import TilesMenu from '../tilesMenu/tilesMenuContainer'
import renderTextArea from '../formFields/renderTextArea'
import renderEditorTextArea from '../formFields/renderEditorTextArea'
import Loader from '../utils/Loader'

class ObjectActions extends Component {
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
        const { object, loading, error } = this.props.activeObject
        if(loading) {
            return <Loader loading={loading}/>
        } else if(error) {
            return <div className="alert alert-danger">Error: {error.message}</div>
        }
        if(object) {
            document.title = object ? 'Акции и Скидки ' + object.NAME: 'Акции и скидки'
            return (
                <div className="container-fluid">
                    <form onSubmit={ handleSubmit(validateAndUpdateObject) }>
                        <Field
                            name="AKCII"
                            component={ renderTextArea }
                            label="Акции и Скидки в Анонс и под фотами (красным)"
                            // onBlur={(event) => {
                            //     setTimeout(handleSubmit(validateAndUpdateObject));
                            // }}
                        />
                        <Field
                            name="AKCII_BOT"
                            component={ renderTextArea }
                            label="Акции и Скидки над Номерами (красным)"
                            // onBlur={(event) => {
                            //     setTimeout(handleSubmit(validateAndUpdateObject));
                            // }}
                        />
                        <Field
                            name="SKIDKI"
                            component={ renderTextArea }
                            label="Скидки (в общем списке, синим)"
                            // onBlur={(event) => {
                            //     setTimeout(handleSubmit(validateAndUpdateObject));
                            // }}
                        />
                        <div>
                            {this.renderSubmitButton(submitting)}
                        </div>
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
    form: 'ObjectActions', // a unique identifier for this form
    //validate, // <--- validation function given to redux-form
    //asyncValidate,
    enableReinitialize: true
})(ObjectActions)