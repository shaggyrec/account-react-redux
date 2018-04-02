import React, { Component } from 'react'

class renderFileInput extends Component {
    constructor(props) {
        super(props)
        this.onChange = this.onChange.bind(this)
    }

    onChange(e) {
        const { input, input: { onChange } } = this.props
        const files = e.target.files
        onChange(files)
    }


    render() {
        const { input, input: { value }, label, accept } = this.props
        delete input.value
        const {meta: { touched, error, invalid, warning }} = this.props
        return (<div className={`form-group ${touched && invalid ? 'has-error' : ''}`}>
            <label className="control-label">{label}</label>
            <div>
                <input {...input} className="form-control form-control__file" type='file' onChange={this.onChange} multiple='multiple' accept={ accept }/>
                <div className="help-block">
                    {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
                </div>
            </div>
        </div>)
    }
}

export default renderFileInput

