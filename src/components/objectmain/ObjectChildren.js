import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { reduxForm, Field, FieldArray, SubmissionError } from 'redux-form'
import renderField from '../formFields/renderField'
import TilesMenu from '../tilesMenu/tilesMenuContainer'
import renderTextArea from '../formFields/renderTextArea'
import renderFieldCheckBox from '../formFields/renderFieldCheckBox'
import Loader from '../utils/Loader'
import FixedBottomBar from '../utils/FixedBottomBar'

class ObjectChildren extends Component {
    componentWillMount() {
        let token = localStorage.getItem('jwtToken');
        //if (!token || token === '') {return;}
        const { object } = this.props.activeObject
        if( !object || +(object.ID) !== +(this.props.objectId)) {
            this.props.fetchObject(this.props.objectId, token);
        }
    }
    renderFieldsArr = ({fields, all}) => {
        let name = fields.name;
        const {validateAndUpdateObject, handleSubmit} = this.props;
        let rows = [];
        for (let key in all) {
            rows.push(
                <li key={key}>
                    <Field
                        id={"[" + name + "]['" + key + "']['value']"}
                        name={"[" + name + "]['" + key + "']['value']"}
                        type='checkbox'
                        component={renderFieldCheckBox}
                        label={all[key]['name']}
                        onChange={(e) => setTimeout(handleSubmit(validateAndUpdateObject))}
                    />
                </li>
            )
        }
        return (<ul>{rows}</ul>)
    }

    renderFields(propName, prop) {
        if (prop) {
            return <FieldArray key={propName} name={propName} component={this.renderFieldsArr} all={prop}/>
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
        const {handleSubmit, submitting, validateAndUpdateObject, initialValues, groupName } = this.props
        const { object, loading, error } = this.props.activeObject;
        if(loading) {
            return <Loader loading={loading}/>
        } else if(error) {
            return <div className="alert alert-danger">Error: {error.message}</div>
        }
        if(object) {
            document.title = object ? 'Детям ' + object.NAME: 'Детям'
            return (
                <div className="container-fluid">
                    <form onSubmit={ handleSubmit(validateAndUpdateObject) }>
                        <Field
                            name="DETI_TEXT"
                            component={ renderTextArea }
                            label="Размещение детей"
                            onBlur={(event) => {
                                setTimeout(handleSubmit(validateAndUpdateObject));
                            }}
                        />
                        <div>
                            <h4>Для детей</h4>
                            <div className="row mt-1">
                                {this.renderFields(groupName, initialValues[groupName])}
                            </div>
                            <hr/>
                        </div>
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
    //validate, // <--- validation function given to redux-form
    //asyncValidate,
    enableReinitialize: true
})(ObjectChildren)