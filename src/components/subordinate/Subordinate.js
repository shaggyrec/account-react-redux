import React, { Component } from 'react'
import PropTypes from  'prop-types'
import { Link } from 'react-router-dom'
import Error from  '../utils/Error'
import LoaderBar from '../utils/LoaderBar'
import { reduxForm, Field, FieldArray, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import renderField from '../formFields/renderField'
import renderSelect from '../formFields/renderSelect'
import SubmitButton from '../formFields/renderSubmitButton'
import { validateSubordinateFields, validateSubordinateFieldsSuccess, validateSubordinateFieldsFailure } from './actions'
import {validateEmail, validateRequired} from '../formFields/validations'
const asyncValidate = (values, dispatch) => {
    const token = localStorage.getItem('jwtToken')
    return dispatch(validateSubordinateFields(values, token))
        .then((result) => {
            //Note: Error's "data" is in result.payload.response.data
            // success's "data" is in result.payload.data
            if (!result.payload) { //1st onblur
                return;
            }
            let {data, status} = result.payload;
            //if status is not 200 or any one of the fields exist, then there is a field error

            if (status != 200 || Object.keys(data).length) {
                //let other components know of error by updating the redux` state
                dispatch(validateSubordinateFieldsFailure(data));
                throw data;
            } else {
                //let other components know that everything is fine by updating the redux` state
                dispatch(validateSubordinateFieldsSuccess(data)); //ps: this is same as dispatching RESET_USER_FIELDS
                return null
            }
        })
};


class Subordinate extends Component {
    constructor(props){
        super(props)
    }
    componentWillMount(){
        const { objects, fetchObjects, fetchSubordinates,subordinate: {subordinates} } = this.props
        if(!Object.keys(objects).length){
            fetchObjects()
        }
        if(!subordinates){
            fetchSubordinates()
        }
    }
    renderExistingSubordinateHint(show, id, fieldIndex){
        const { change, handleSubmit,validateAndUpdateSubordinate, asyncValidate, subordinateField} = this.props
        if(show && id){
            return(
                <div className='contextHint'>
                    <div className='contextHint__inner elegant-color white-text shadow'>
                        <h5>Назначить пользователя с этим email контактным лицом?</h5>
                        <button className="btn btn-sm btn-danger" type='button'
                                onClick={e => {
                                        change('subordinate['+fieldIndex+'].id',id)
                                        subordinateField[fieldIndex].id = id
                                        setTimeout(()=> validateAndUpdateSubordinate({subordinate:subordinateField}),500)
                                }}
                        >Да</button>
                        <button className="btn btn-sm btn-warning" type='button' onClick={e => {
                                change('subordinate['+fieldIndex+'].email','')
                                change('subordinate['+fieldIndex+'].id','')
                                setTimeout(asyncValidate)
                        }}>Нет</button>
                    </div>
                </div>
            )
        }else{
            //change('subordinate['+fieldIndex+'].id','')
            return <span/>
        }
    }
    renderSubordinate = ({fields}) => {
        const { array: { push }, handleSubmit, pristine, reset, submitting, subordinate:{subordinates,error} , objects, valid, validateAndUpdateSubordinate,subordinateField } = this.props
        return(
            <ul className="mb-2">
                {fields.map((field, fieldIndex) => {
                        if ( (subordinates && subordinates[fieldIndex] && subordinates[fieldIndex].ACTIVE === 'Y') ) {
                            return (
                                <li key={fieldIndex} className="card grey lighten-3 mb-1">
                                    <div className="card-block">
                                        <div className="row">
                                            <div className="col-sm-7">
                                                <div className="row">
                                                    <div className="col-sm-4 notAllowed">
                                                        <div className="labelActive">
                                                            Email
                                                        </div>
                                                        {subordinates[fieldIndex].EMAIL}
                                                        <hr/>
                                                        <Field
                                                            component='input'
                                                            type="hidden"
                                                            name={`${field}.id`}
                                                        />
                                                    </div>
                                                    <div className="col-sm-4 notAllowed">
                                                        <div className="labelActive">
                                                            Телефон
                                                        </div>
                                                        {subordinates[fieldIndex].PERSONAL_MOBILE}
                                                        <hr/>
                                                    </div>
                                                    <div className="col-sm-4 notAllowed">
                                                        <div className="labelActive">
                                                            Должность
                                                        </div>
                                                        {subordinates[fieldIndex].WORK_POSITION}
                                                        <hr/>
                                                    </div>
                                                    <div className="col-sm-12 notAllowed">
                                                        <div className="labelActive">
                                                            Фио
                                                        </div>
                                                        {subordinates[fieldIndex].NAME} {subordinates[fieldIndex].SECOND_NAME} {subordinates[fieldIndex].LAST_NAME}
                                                        <hr/>
                                                    </div>
                                                </div>
                                            </div><div className="col-sm-4">
                                            <Field
                                                component={renderSelect}
                                                multiple={true}
                                                name={`${field}.objects`}
                                                label="Доступ к объектам"
                                                options={objects}
                                            />
                                        </div>
                                            <div className="col-sm-1 d-flex align-items-start justify-content-end">
                                                <button
                                                    className="btn red btn-sm"
                                                    type="button"
                                                    title="Удалить контактное лицо"
                                                    onClick={() => {
                                                        if(window.confirm('Вы уверены, что хотите удалить это контактное лицо?')) {
                                                            fields.remove(fieldIndex)
                                                            setTimeout(handleSubmit(validateAndUpdateSubordinate))
                                                        }
                                                    }}>
                                                    <i className="fa fa-trash" aria-hidden="true"/>
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <SubmitButton submitting={submitting} disabled={!valid}>
                                                Сохранить
                                            </SubmitButton>
                                        </div>
                                    </div>
                                </li>
                            )
                        } else {
                            return (<li key={fieldIndex} className="card grey lighten-3 mb-1">
                                    <div className="card-block">
                                        <div className="row">
                                            <div className="col-sm-7">
                                                <div className="row">
                                                    <div className="col-sm-4">
                                                        <Field name={`${field}.email`} component={renderField} type="email"
                                                               label="Email(Логин)"
                                                               validate={[validateRequired, validateEmail]}/>
                                                        {this.renderExistingSubordinateHint(error && error.subordinate && error.subordinate[fieldIndex] && error.subordinate[fieldIndex].email, error && error.subordinate && error.subordinate[fieldIndex] && error.subordinate[fieldIndex].id, fieldIndex)}

                                                        <Field
                                                            component='input'
                                                            type="hidden"
                                                            name={`${field}.id`}
                                                        />
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <Field name={`${field}.phone`} component={renderField} type="text"
                                                               label="Телефон" validate={validateRequired}/>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <Field
                                                            component={renderField}
                                                            type="text"
                                                            name={`${field}.workPosition`}
                                                            label="Должность"
                                                            validate={validateRequired}
                                                        />
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <Field name={`${field}.lastName`} component={renderField}
                                                               type="text"
                                                               label="Фамилия" validate={validateRequired}/>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <Field name={`${field}.name`} component={renderField} type="text"
                                                               label="Имя" validate={validateRequired}/>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <Field name={`${field}.secondName`} component={renderField}
                                                               type="text"
                                                               label="Отчество"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <Field
                                                    component={renderSelect}
                                                    multiple={true}
                                                    name={`${field}.objects`}
                                                    label="Доступ к объектам"
                                                    options={objects}
                                                />
                                            </div>
                                            <div className="col-sm-1 d-flex align-items-start justify-content-end">
                                                <button
                                                    className="btn red btn-sm"
                                                    type="button"
                                                    title="Удалить контактное лицо"
                                                    onClick={() => {
                                                        if(window.confirm('Вы уверены, что хотите удалить это контактное лицо?')) {
                                                            fields.remove(fieldIndex)
                                                            setTimeout(handleSubmit(validateAndUpdateSubordinate))
                                                        }
                                                    }}>
                                                    <i className="fa fa-trash" aria-hidden="true"/>
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <SubmitButton submitting={submitting} disabled={!valid}>
                                                Сохранить
                                            </SubmitButton>
                                        </div>
                                    </div>
                                </li>
                            )
                        }
                    }
                    )
                }
                <li className="mt-1">
                    <button className="btn btn-md red" type="button" onClick={() => push('subordinate', {})}><i className="fa fa-plus"/> Добавить контактное лицо</button>
                </li>
            </ul>
        )
    }

    render(){
        const { user:{user, error},subordinate:{subordinates}, handleSubmit, submitting,validateAndUpdateSubordinate}  = this.props
        document.title = 'Контактные лица'
        //console.log(subordinates)
        return (
            <form onSubmit={ handleSubmit(validateAndUpdateSubordinate)}>
                <h4>Контактные лица</h4>
                <hr/>
                <FieldArray name="subordinate" component={this.renderSubordinate}/>
                <LoaderBar loading={submitting}/>
            </form>
        )
    }
}
Subordinate = reduxForm({
    form: 'Subordinate', // a unique identifier for this form
    //validate,
    asyncValidate,
    enableReinitialize: true
})(Subordinate)

const selector = formValueSelector('Subordinate') // <-- same as form name
Subordinate = connect(state => {
    const subordinateField = selector(state, 'subordinate');
    return {
        subordinateField
    }
})(Subordinate)

export default Subordinate