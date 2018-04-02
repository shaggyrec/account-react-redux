import React from 'react';


const renderField = ({ input, label, type,className, disabled, forceValue, meta: { touched, error, invalid, warning } }) => {
    if(type === 'hidden'){
       return  <input {...input} id={input.name} type={type} value={forceValue}/>
    }else {
        return (<div className={`md-form ${touched && invalid ? 'has-error' : ''}`}>
            <input {...input} id={input.name} className={`form-control ${className ? className : ''}`} type={type}
                   disabled={disabled}/>
            <label className={`control-label ${input.value || type === 'date' ? 'active' : ''}`} htmlFor={input.name}>{label}</label>
            <div className="help-block">
                {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
            </div>
        </div>
        )
    }
}

export default renderField;