import React, { Component, PureComponent } from 'react'
import PropTypes from  'prop-types'
import { Link } from 'react-router-dom'
import Error from  '../utils/Error'
import LoaderBar from '../utils/LoaderBar'
import { reduxForm, Field } from 'redux-form'
import renderField from '../formFields/renderField'
import SubmitButton from '../formFields/renderSubmitButton'

const validate = (values) => {
    var errors = {};
    var hasErrors = false;
    if (!values.password || values.password.trim() === '') {
        errors.password = 'Задайте пароль';
        hasErrors = true;
    }
    if (values.password && values.password.length < 6) {
        errors.password = 'Пароль должен быть не короче 6 символов';
        hasErrors = true;
    }
    if (!values.confirmPassword || values.confirmPassword.trim() === '') {
        errors.confirmPassword = 'Повторите пароль';
        hasErrors = true;
    }

    if (values.confirmPassword && values.confirmPassword.trim() !== '' && values.password && values.password.trim() !== '' && values.password !== values.confirmPassword) {
        errors.password = 'Пароль и подтверждение не совпадают';
        hasErrors = true;
    }
    return hasErrors && errors
}

class Security extends Component {
    render(){
        const { user:{user, error}, handleSubmit, submitting, changePassword}  = this.props
        document.title = 'Безопасность'
        return (
            <form onSubmit={ handleSubmit(changePassword)}>
                <h3>Безопасность {user.name}</h3>
                <hr/>
                <Error error={error}/>
                <h4>Сменить пароль</h4>
                <div className="row">
                    <div className="col-sm-3">
                        <Field
                            component={renderField}
                            type='password'
                            label="Новый пароль"
                            name="password"
                        />
                    </div>
                    <div className="col-sm-3">
                        <Field
                            component={renderField}
                            type='password'
                            label="Повторите пароль"
                            name="confirmPassword"
                        />
                    </div>
                </div>
                <SubmitButton submitting={submitting}/>
            </form>
        )
    }
}

export default reduxForm({
    form: 'Security', // a unique identifier for this form
    validate,
    //asyncValidate,
    enableReinitialize: true
})(Security)