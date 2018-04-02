import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { reduxForm, Field, SubmissionError, formValueSelector } from 'redux-form'
import renderField from '../formFields/renderField'
import renderSelect from '../formFields/renderSelect'
import renderTextArea from '../formFields/renderTextArea'
import renderRange from '../formFields/renderRange'


import { createRoom, createRoomSuccess, createRoomFailure, resetNewRoom } from './actions';
import {connect} from 'react-redux'

const lessThan = otherField => (value, previousValue, allValues) =>
    !allValues[otherField] || parseFloat(value) < parseFloat(allValues[otherField]) ? value : allValues[otherField]
const greaterThan = otherField => (value, previousValue, allValues) =>
    !allValues[otherField] || parseFloat(value) > parseFloat(allValues[otherField]) ? value : allValues[otherField]

//Client side validation
function validate(values) {
    const errors = {};

    if (!values.TYPE || values.TYPE.trim() === '') {
        errors.TYPE = 'Выберите тип';
    }
    if (!values.VSEGO || values.VSEGO.trim() === '') {
        errors.VSEGO = 'Введите общее количество номеров';
    }
    if (!values.PLO || values.PLO === 0) {
        errors.PLO = 'Введите площадь номера';
    }
    if (!values.GOS_OT || values.GOS_OT.trim() === '') {
        errors.GOS_OT = 'Введите минимальное количество гостей';
    }
    if (!values.GOS_DO || values.GOS_DO.trim() === '') {
        errors.GOS_DO = 'Введите максимальное количество гостей';
    }

    return errors;
}

//For instant async server validation
// const asyncValidate = (values, dispatch) => {
//     let token = localStorage.getItem('jwtToken');
//     if(!token) return
//     return dispatch(validateRoomFields(values, token))
//         .then((result) => {
//             //Note: Error's "data" is in result.payload.response.data
//             // success's "data" is in result.payload.data
//             if (!result.payload.response) { //1st onblur
//                 return;
//             }
//
//             let {data, status} = result.payload.response;
//             //if status is not 200 or any one of the fields exist, then there is a field error
//             if (result.payload.response.status != 200 || data.title || data.categories || data.description) {
//                 //let other components know of error by updating the redux` state
//                 dispatch(validateRoomFieldsFailure(data));
//                 throw data; //throw error
//             } else {
//                 //let other components know that everything is fine by updating the redux` state
//                 dispatch(validateRoomFieldsSuccess(data)); //ps: this is same as dispatching RESET_USER_FIELDS
//             }
//         });
// };

//For any field errors upon submission (i.e. not instant check)
const validateAndCreateRoom = (values, dispatch) => {
    let token = localStorage.getItem('jwtToken');
    if (!token || token === '') {
        //if there is no token, dont bother,
        var data = { data: { message: 'Please Sign In' } }; //axios like error
        dispatch(createRoomFailure(data));
        throw new SubmissionError(data);
    }
    return dispatch(createRoom(values, token))
        .then(result => {
            // Note: Error's "data" is in result.payload.response.data (inside "response")
            // success's "data" is in result.payload.data
            if (result.payload.response && result.payload.response.status !== 200) {
                dispatch(createRoomFailure(result.payload.response.data));
                throw new SubmissionError(result.payload.response.data);
            }
            //let other components know that everything is fine by updating the redux` state
            dispatch(createRoomSuccess(result.payload.data)); //ps: this is same as dispatching RESET_USER_FIELDS
        });
}



class RoomsForm extends Component {
    static contextTypes = {
        router: PropTypes.object
    };

    componentWillMount() {
        //Important! If your component is navigating based on some global state(from say componentWillReceiveProps)
        //always reset that global state back to null when you REMOUNT
        this.props.resetMe();
        let token = localStorage.getItem('jwtToken');
        const { object } = this.props.activeObject;
        if( !object || +(object.ID) !== +(this.props.objectId)) {
            this.props.fetchObject(this.props.objectId, token);
        }
        this.props.fetchRoomTypes()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.newRoom.room && !nextProps.newRoom.error) {
            this.props.resetActiveObject()
            this.context.router.history.push('/lk/' + nextProps.objectId + '/rooms/' + nextProps.newRoom.room.id)
        }
    }

    renderError(newRoom) {
        if (newRoom && newRoom.error && newRoom.error.message) {
            return (
                <div className="alert alert-danger">
                    { newRoom ? newRoom.error.message : '' }
                </div>
            );
        } else {
            return <span></span>
        }
    }
    renderUserTypeField(){
        const { TYPE } = this.props
        if(parseInt(TYPE) ===  4449){
            return(
                <div>
                    <Field
                        component={renderField}
                        type='text'
                        label='Свой тип номера'
                        name='USER_TYPE'
                    />
                    <div style={{marginTop:'-1rem',lineHeight:'1'}}>
                        <small>Ваше оригинальное название категории номера будет доступно после проверки модератором</small>
                    </div>
                </div>
            )
        }else{
            return <div/>
        }
    }
    render() {
        const {handleSubmit, submitting, newRoom, objectId, roomTypes, typesList} = this.props
        const roomTypesArray = roomTypes.types || []
        document.title = 'Добавление Номера'
        return (
            <div className='container'>
                <div className="pageTitle mb-2">
                    <h1>Добавить номер</h1>
                    <hr/>
                </div>
                { this.renderError(newRoom) }
                <form onSubmit={ handleSubmit(validateAndCreateRoom) }>
                    <Field
                        name='parent'
                        type='hidden'
                        component='input'
                    />
                    <Field
                        name='NAME'
                        type='hidden'
                        component='input'
                    />
                    <div className="row mt-3">
                        <div className="col-sm-4">
                            <Field
                                name="TYPE"
                                component={ renderSelect }
                                label="Тип номера"
                                firstOptionText="Выберите тип номера"
                                // options={roomTypes.types}
                                onChange={(e)=>{
                                    this.props.change('name', typesList[e.target.value])
                                }}
                                onBlur={(e)=>{
                                    this.props.change('name', typesList[e.target.value])
                                }}
                            >
                                <option value=''>Выберите тип номера</option>
                                {roomTypesArray.map(type => (
                                    <option key={type.ID} value={type.ID}>{type.VALUE}</option>
                                ))}
                            </Field>
                        </div>
                        <div className="col-sm-4">
                            {this.renderUserTypeField()}
                        </div>
                    </div>
                    <div className="row mt-5">
                        <div className="col-sm-2">
                            <Field
                                name='PLO'
                                type='number'
                                label='Площадь, кв.м (потяните ползунок или введите значение в поле)'
                                component={renderRange}
                                defaultValue={0}
                                min={1}
                                max={200}
                                step={.5}
                                onMove={(val)=>{
                                    this.props.change('PLO', val)
                                }}
                            />
                        </div>
                        <div className="col-sm-2">
                            <Field
                                name='VSEGO'
                                type='number'
                                label='Всего номеров'
                                component={renderField}
                            />
                        </div>
                    </div>
                    <div className="row mt-2 mb-1">
                        <div className="col-sm-12 d-flex flex-column justify-content-center font-weight-bold mb-1">
                            <div>Число гостeй:</div>
                        </div>
                        <div className="col-sm-2">
                            <Field
                                name='GOS_OT'

                                label='От'
                                component={renderSelect}
                                firstOptionText="Выберите"
                                options={{
                                    1:1,
                                    2:2,
                                    3:3,
                                    4:4,
                                    5:5,
                                    6:6,
                                    7:7,
                                    8:8,
                                    9:9,
                                    10:10
                                }}
                                normalize={lessThan('GOS_DO')}
                            />
                        </div>
                        <div className="col-sm-2">
                            <Field
                                name='GOS_DO'
                                label='До'
                                component={renderSelect}
                                firstOptionText="Выберите"
                                options={{
                                    1:1,
                                    2:2,
                                    3:3,
                                    4:4,
                                    5:5,
                                    6:6,
                                    7:7,
                                    8:8,
                                    9:9,
                                    10:10
                                }}
                                normalize={greaterThan('GOS_OT')}
                            />
                        </div>
                        <div className="col-sm-2">
                            <Field
                                name='EXTRA_COUNT_TO'
                                type='number'
                                label='Количество доп. мест'
                                component={renderField}
                            />
                        </div>
                        <div className="col-sm-2">
                            <Field
                                name='CHILD_COUNT_TO'
                                type='number'
                                label='Количество мест для детей'
                                component={renderField}
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={ submitting }>
                            Создать
                        </button>
                        <Link
                            to={`/lk/${objectId}/rooms`}
                            className="btn btn-default"> отмена
                        </Link>
                    </div>
                </form>
            </div>
        )
    }
}




RoomsForm = reduxForm({
    form: 'RoomsForm', // a unique identifier for this form
    validate, // <--- validation function given to redux-form
    enableReinitialize: true
})(RoomsForm)

// Decorate with connect to read form values
const selector = formValueSelector('RoomsForm') // <-- same as form name
RoomsForm = connect(state => {
    const name = selector(state, 'NAME')
    const PLO = selector(state, 'PLO')
    const TYPE = selector(state, 'TYPE')
    return {
        name,
        PLO,
        TYPE
    }
})(RoomsForm)

export default RoomsForm