import React, { Component } from 'react'
import Select, {Creatable} from 'react-select'

export class AutocompleteField extends Component {

    constructor(props) {
        super(props);
    }

    render = () => {
        const {input, options, noResultsText, filterOption, label, placeholder, onInputChange, disabled, meta: {touched, error, invalid, warning}, isCreatable, promptTextCreator} = this.props
        if (isCreatable) {
            return (
                <div className={`md-form ${touched && invalid ? 'has-error' : ''}`}>
                    <Creatable
                        {...input}
                        name={input.name}
                        options={options}
                        onBlur={() => {
                            input.onBlur(input.value)
                        }}
                        onChange={input.onChange}
                        placeholder={placeholder}
                        onInputChange={onInputChange}
                        noResultsText={noResultsText}
                        filterOption={filterOption}
                        disabled={disabled}
                        ignoreCase={true}
                        promptTextCreator={promptTextCreator}
                        isOptionUnique={(e)=>{
                            let curVal = e.option.value.toLowerCase()
                            for(let opt of e.options){
                                if(curVal === opt.label.toLowerCase()                                                                                                                                                                                                                                                                                                                                                           ){
                                    return false;
                                }
                            }
                            return true
                        }}
                    />
                    <label className={`control-label active`} htmlFor={input.name}>{label}</label>
                    <div className="help-block">
                        {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
                    </div>
                </div>
            );
        } else {
            return (
                <div className={`md-form ${touched && invalid ? 'has-error' : ''}`}>
                    <Select
                        {...input}
                        name={input.name}
                        options={options}
                        onBlur={() => {
                            input.onBlur(input.value)
                        }}
                        onChange={input.onChange}
                        placeholder={placeholder}
                        onInputChange={onInputChange}
                        noResultsText={noResultsText}
                        filterOption={filterOption}
                        disabled={disabled}
                    />
                    <label className={`control-label active`} htmlFor={input.name}>{label}</label>
                    <div className="help-block">
                        {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
                    </div>
                </div>
            );
        }
    }
}

const RenderAutocompleteField = props => (<AutocompleteField {...props}/>)

export default RenderAutocompleteField