import React, { Component, PureComponent } from 'react'
import PropTypes from  'prop-types'
import { Link } from 'react-router-dom'
import Error from  '../utils/Error'
import Loader from '../utils/Loader'
import LoaderBar from '../utils/LoaderBar'
import { reduxForm, Field } from 'redux-form'
import renderField from '../formFields/renderField'
import SubmitButton from '../formFields/renderSubmitButton'

class Profile extends PureComponent {
    componentWillMount(){
        this.props.getUser()
    }
    render(){
        const { user:{user, error}, handleSubmit, submitting,validateAndUpdateUser}  = this.props
        document.title = 'Профиль'
        if(user){
            return (
                <div>
                    <h3>Профиль {user.name}</h3>
                    <hr/>
                    <form onSubmit={ handleSubmit(validateAndUpdateUser)}>
                        <Error error={error}/>
                        <div className="row">
                            <div className="col-sm-4">
                                <Field
                                    component={renderField}
                                    type="text"
                                    name="lastName"
                                    label="Фамилия"
                                />
                            </div>
                            <div className="col-sm-4">
                                <Field
                                    component={renderField}
                                    type="text"
                                    name="name"
                                    label="Имя"
                                />
                            </div>
                            <div className="col-sm-4">
                                <Field
                                    component={renderField}
                                    type="text"
                                    name="secondName"
                                    label="Отчество"
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-4 notAllowed">
                                <div className="labelActive">
                                    Email
                                </div>
                                {user.email}
                                <hr/>
                            </div>
                            <div className="col-sm-4">
                                <Field
                                    component={renderField}
                                    type="text"
                                    name="phone"
                                    label="Телефон"
                                />
                            </div>
                            <div className="col-sm-4">
                                <Field
                                    component={renderField}
                                    type="text"
                                    name="workPosition"
                                    label="Должность"
                                />
                            </div>
                        </div>
                        <SubmitButton submitting={submitting}/>
                    </form>
                    <LoaderBar loading={submitting}/>
                </div>
            )
        }else {
            return (<Loader loading={true}/>)
        }
    }
}

export default reduxForm({
    form: 'Profile', // a unique identifier for this form
    //validate, // <--- validation function given to redux-form
    //asyncValidate,
    enableReinitialize: true
})(Profile)