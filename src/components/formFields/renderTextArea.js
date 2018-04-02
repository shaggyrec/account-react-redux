import React from 'react'


const renderField = ({ input, label, type, meta: { touched, error, invalid, warning } }) => (
    <div className={`md-form ${touched && invalid ? 'has-error' : ''}`}>
        <textarea id={input.name} {...input} className="form-control md-textarea" type={type}/>
        <label  className={`control-label ${input.value ? 'active' : ''}`} htmlFor={input.name}>{label}</label>
        <div className="help-block">
            {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
        </div>
    </div>
)

export default renderField;