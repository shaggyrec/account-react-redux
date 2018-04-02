import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { reduxForm, Field, FieldArray, SubmissionError } from 'redux-form'
import renderField from '../formFields/renderField'
import renderTextArea from '../formFields/renderTextArea'
import TilesMenu from '../tilesMenu/tilesMenuContainer'
import renderFileInput from '../formFields/renderFileInput'
import renderEditorTextArea from '../formFields/renderEditorTextArea'
import renderFieldCheckBox from '../formFields/renderFieldCheckBox'
import Loader from "../utils/Loader";
//import { updatePost, updatePostSuccess, updatePostFailure, resetActivePost } from './actions'

const validateAndUpdateObject = function () {
    return;
}

class ObjectDesc extends Component {
    componentWillMount() {
        let token = localStorage.getItem('jwtToken');
      //  if (!token || token === '') {return;}
        const { object } = this.props.activeObject
        if( !object || +(object.ID) !== +(this.props.objectId)) {
            this.props.fetchObject(this.props.objectId, token);
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
            document.title = object ? 'Описание ' + object.NAME: 'Описание объекта'
            return (
                <div className="container-fluid">
                    <form className="mt-2" onSubmit={ handleSubmit(validateAndUpdateObject) }>
                        neen
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
})(ObjectDesc)