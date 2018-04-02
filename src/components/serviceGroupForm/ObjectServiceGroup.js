import React, {Component} from 'react'
import {reduxForm, Field, FieldArray} from 'redux-form'
import renderFieldCheckBox from '../formFields/renderFieldCheckBox'
import renderField from '../formFields/renderField'
import LoaderBar from '../utils/LoaderBar'
import renderTextArea from '../formFields/renderTextArea'
import FixedBottomBar from '../utils/FixedBottomBar'
class ObjectServiceGroup extends Component {
    renderFieldsArr = ({fields, all}) => {
        let name = fields.name;
        const {validateAndUpdateObjectPropsGroup, handleSubmit} = this.props;
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
                        onChange={(e) => setTimeout(handleSubmit(validateAndUpdateObjectPropsGroup))}
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

    renderSubmitButton(submitting) {
        if (submitting) {
            return (
                <button className="btn btn-success" type="submit" disabled={true}>
                    Сохраняю...
                </button>
            )
        } else {
            return (
                <button className="btn red" type="submit">
                    Применить
                </button>
            )
        }
    }

    render() {
        const {validateAndUpdateObjectPropsGroup, handleSubmit, initialValues, submitting} = this.props;
        const {groupName, groupProps, error} = this.props;
        let bankDetails = (<div></div>);
        if (groupName == 'oplata') {
            bankDetails = (<div><Field component={renderTextArea} name="REKVIZIT" type="textarea"
                                       label="Наши реквизиты"/>
                    <div>
                        {this.renderSubmitButton(submitting)}
                    </div>
                </div>
            );
        }
        //formName += groupName;
        if (groupName && groupProps && initialValues.hasOwnProperty(groupName)) {
            return (
                <div className="col-lg-4 col-md-6 col-12">
                    <form className="container-fluid" onSubmit={ handleSubmit(validateAndUpdateObjectPropsGroup) }>
                        <h4>{groupProps.NAME}</h4>
                        <div className="row mt-1">
                            {this.renderFields(groupName, initialValues[groupName])}
                        </div>
                        <hr/>
                        {bankDetails}
                    </form>
                    <LoaderBar loading={submitting}/>
                </div>
            );
        }
    }
}

export default reduxForm({
    //form: 'ObjectServiceGroup',
    enableReinitialize: true
})(ObjectServiceGroup)