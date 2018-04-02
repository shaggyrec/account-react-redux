import React from 'react';


const renderOptions = function (options,inputVal,firstOptionText){
    const o = () => {
        let optArr = []
        if(firstOptionText){
            optArr.push(<option key={firstOptionText} value=''>{firstOptionText}</option>)
        }
        for (let val in options) {
            // if(inputVal === val) {
            //     optArr.push(<option key={val} value={val} selected='selected'>{options[val]}</option>)
            // }else{
                optArr.push(<option key={val} value={val}>{options[val]}</option>)
            // }
        }
        return optArr
    }
    return o()
}

const renderSelect = ({ input, label, type,className, options,multiple, firstOptionText,disabled, children, meta: { touched, error, invalid, warning } }) => (
    <div className={`md-form ${touched && invalid ? 'has-error' : ''}`}>
        <select {...input} id={input.name} className={`form-control ${className ? className : ''}`}  disabled={disabled} value={input.value} multiple={!!multiple}>
            {children || renderOptions(options, input.value,firstOptionText)}
        </select>
        <label className={`control-label ${input.value ? 'active' : ''}`} htmlFor={input.name}>{label}</label>
        <div className="help-block">
            {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
        </div>

    </div>
)

export default renderSelect;