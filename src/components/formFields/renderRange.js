import React from 'react';
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css';


const renderRange = ({ input, label, type,className, disabled, min, max, defaultValue, step, onMove, onchange, meta: { touched, error, invalid, warning } }) => (
    <div className={`md-form ${touched && invalid ? 'has-error' : ''}`}>
        <div className="mb-1" style={{paddingTop:'.4rem'}}>
            <Slider min={min} max={max} defaultValue={defaultValue} value={input.value || defaultValue} step={step} onChange={onMove}/>
            <input {...input} min={min} max={max} step={step} type="number" value={ input.value || defaultValue } onChange={onchange}/>
        </div>
        <label className={`control-label active ${input.value ? 'active' : ''}`} htmlFor={input.name}>{label}</label>
        <div className="help-block">
            {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
        </div>

    </div>
)

export default renderRange;