import React from 'react';


const renderField = ({input, id, label, type, meta: {touched, error, invalid, warning}}) => {
    return (
        <div className={`form-group ${touched && invalid ? 'has-error' : ''}`}>
            <div className="switch">
                <label htmlFor={id} className="d-inline-flex align-items-center">
                    <div>
                        <input {...input} id={id} placeholder={label} type={type}/>
                        <span className="lever"></span>
                    </div>
                    <div>{label}</div>
                </label>
                <div className="help-block">
                    {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
                </div>
            </div>
        </div>
    )
}

export default renderField;