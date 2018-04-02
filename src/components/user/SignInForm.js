import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { reduxForm, Field, SubmissionError } from 'redux-form'
import renderField from '../formFields/renderField'
import { signInUser, signInUserSuccess, signInUserFailure, resetUserFields } from './actions'
import Error from '../utils/Error'

//Client side validation
function validate(values) {
    var errors = {};
    var hasErrors = false;
    if (!values.email || values.email.trim() === '') {
        errors.email = 'Введите Email';
        hasErrors = true;
    }
    if (!values.password || values.password.trim() === '') {
        errors.password = 'Введите пароль';
        hasErrors = true;
    }
    return hasErrors && errors;
}

//For any field errors upon submission (i.e. not instant check)
const validateAndSignInUser = (values, dispatch) => {
    return dispatch(signInUser(values))
        .then((result) => {
            // Note: Error's "data" is in result.payload.response.data (inside "response")
            // success's "data" is in result.payload.data
            if (result.error || result.payload.response && result.payload.response.status !== 200) {
                dispatch(signInUserFailure(result.payload || result.payload.response.data));
                throw new SubmissionError(result.payload || result.payload.response.data);
            }

            //Store JWT Token to browser session storage
            //If you use localStorage instead of sessionStorage, then this w/ persisted across tabs and new windows.
            //sessionStorage = persisted only in current tab
            localStorage.setItem('jwtToken', result.payload.data.token);
            //let other components know that everything is fine by updating the redux` state
            dispatch(signInUserSuccess(result.payload.data)); //ps: this is same as dispatching RESET_USER_FIELDS
        });
};



class SignInForm extends Component {
    static contextTypes = {
        router: PropTypes.object
    };

    componentWillMount() {
        //Important! If your component is navigating based on some global state(from say componentWillReceiveProps)
        //always reset that global state back to null when you REMOUNT
        this.props.resetMe();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user.status === 'authenticated' && nextProps.user.user && !nextProps.user.error) {
            let refLink = this.context.router.route.location.state && this.context.router.route.location.state.from ? this.context.router.route.location.state.from : '/lk/';
            this.context.router.history.push(refLink);
        }

        //error
        //Throw error if it was not already thrown (check this.props.user.error to see if alert was already shown)
        //If u dont check this.props.user.error, u may throw error multiple times due to redux-form's validation errors
        if (nextProps.user.status === 'signin' && !nextProps.user.user && nextProps.user.error && !this.props.user.error) {
           // alert(nextProps.user.error.message);
        }
    }

    render() {
        const {asyncValidating, handleSubmit, submitting, user } = this.props;
        document.title = 'Вход - Edem-V-Gosti.ru'
        return (
            <div className="container">
                <div className="pageTitle">
                    <h1>Вход</h1>
                </div>
                <Error error={user.error}/>
                <form onSubmit={ handleSubmit(validateAndSignInUser) }>
                    <Field
                        name="email"
                        type="text"
                        component={ renderField }
                        label="Email" />
                    <Field
                        name="password"
                        type="password"
                        component={ renderField }
                        label="Пароль" />
                    <div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={ submitting }>
                            Войти
                        </button>
                        <Link
                            to="/lk/registration"
                            className="btn btn-default"> Регистрация
                        </Link>
                    </div>
                </form>
            </div>
        )
    }
}

export default reduxForm({
    form: 'SignInForm', // a unique identifier for this form
    validate // <--- validation function given to redux-form
})(SignInForm)