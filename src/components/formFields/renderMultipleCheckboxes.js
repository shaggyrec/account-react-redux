import React, { Component } from 'react'
import { reduxForm, Field, FieldArray, SubmissionError } from 'redux-form'
import renderFieldCheckBox from './renderFieldCheckBox'

const renderFieldsArr = ({ fields, all }) => {
    const {validateAndUpdateObject, handleSubmit} = this.props
    return(<ul>
            {fields.map((field, index) => {
                    return(
                        <li key={all[index]}>
                            <Field
                                id={field}
                                name={field}
                                type='checkbox'
                                component={renderFieldCheckBox}
                                label={all[index]}
                                onChange = {(e) => setTimeout(handleSubmit(validateAndUpdateObject))}
                            />
                        </li>
                    )
                }
            )}
        </ul>
    )
}

const renderFields = (propName, props, componentProps) => {
    const {validateAndUpdateObject, handleSubmit} = componentProps
    if(props){
        var propsArr = []
        let i=0
        for(let prop in props){
            if(prop === propName){
                propsArr[i]= []
                propsArr[i]['name'] = prop
                propsArr[i]['all'] = props[prop]['all']
                i++;
            }
        }
        return propsArr.map((prop) => {
            return <FieldArray key={prop} name={prop.name} component={this.renderFieldsArr} all={prop.all}/>
        })

    }else{
        <div/>
    }
}

export default renderFields;