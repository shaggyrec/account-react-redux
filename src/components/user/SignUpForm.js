import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { reduxForm, Field, FieldArray,SubmissionError, change, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import renderField from '../formFields/renderField'
import renderSelect from '../formFields/renderSelect'
import normalizePhone from '../formFields/normalizePhone'
import RenderAutocompleteField, {AutocompleteField} from '../formFields/renderAutocompleteField'
import { signUpUser, signUpUserSuccess, signUpUserFailure, validateUserFields, validateUserFieldsSuccess, validateUserFieldsFailure } from './actions'
import YandexMap from '../utils/Map'
import Loader from '../utils/Loader'
import Error from '../utils/Error'
import InfoCard from '../utils/InfoCard'
import  Api  from 'yandex-map-react/lib/api'
import '../../st/reactselect.css'

//Client side validation
function validate(values) {
    var errors = {};
    var hasErrors = false;
    if (!values.name || values.name.trim() === '') {
        errors.name = 'Введите имя';
        hasErrors = true;
    }
    if (!values.lastname || values.lastname.trim() === '') {
        errors.lastname = 'Введите фамилию';
        hasErrors = true;
    }

    // if (!values.username || values.username.trim() === '') {
    //     errors.username = 'Enter username';
    //     hasErrors = true;
    // }
    if (!values.email || values.email.trim() === '') {
        errors.email = 'Введите email';
        hasErrors = true;
    }
    if (!values.phone || values.phone.trim() === '') {
        errors.phone = 'Введите номер телефона';
        hasErrors = true;
    }

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
    if (!values.objectName || values.objectName.trim() === '') {
        errors.objectName = 'Введите название объекта';
        hasErrors = true;
    }
    if (!values.city) {
        errors.city = 'Введите город, в котором находится объект';
        hasErrors = true;
    }
    if (!values.roomsCount){
        errors.roomsCount = 'Введите количество номеров';
        hasErrors = true;
    }

    // if(!values.region || !values.region[values.region.length-1].id){
    //     if(!values.region) {
    //         errors.region = 'Обязательно для заполнения';
    //     }else{
    //         errors.region = {}
    //         errors.region[values.region.length-1] = {}
    //         errors.region[values.region.length-1].id = 'Обязательно для заполнения';
    //     }
    //     hasErrors = true;
    // }
    if (!values.address) {
        errors.address = 'Введите адрес объекта';
        hasErrors = true;
    }

    if (!values.type || values.type.trim() === 'Выберите') {
        errors.type = 'Выберите тип объекта';
        hasErrors = true;
    }
    if(!values.paymentType){
        errors.paymentType = 'Выберите тип размещения'
        hasErrors = true
    }
    //          console.log(values)
    return hasErrors && errors;
}



// //For instant async server validation
const asyncValidate = (values, dispatch) => {
    return dispatch(validateUserFields(values))
        .then((result) => {
            //Note: Error's "data" is in result.payload.response.data
            // success's "data" is in result.payload.data
            if (!result.payload) { //1st onblur
                return;
            }
            let {data, status} = result.payload;
            //if status is not 200 or any one of the fields exist, then there is a field error
            if (status != 200 || data.username || data.email) {
                //let other components know of error by updating the redux` state
                dispatch(validateUserFieldsFailure(data));
                throw data;
            } else {
                //let other components know that everything is fine by updating the redux` state
                dispatch(validateUserFieldsSuccess(data)); //ps: this is same as dispatching RESET_USER_FIELDS
                return null
            }
        })
};

const getPhoneCode = (c, arC) => {
    if (parseInt(c) && arC)
    {
        for (let i of arC)
        {
            if (c == i.ID)
            {
                return i.PHONE_CODE;
            }
        }
    }
}

//For any field errors upon submission (i.e. not instant check)
const validateAndSignUpUser = (values, dispatch) => {
    return dispatch(signUpUser(values))
        .then((result) => {

            // Note: Error's "data" is in result.payload.response.data (inside "response")
            // success's "data" is in result.payload.data
            if (result.payload.response && result.payload.response.status !== 200) {
                dispatch(signUpUserFailure(result.payload.response.data));
                throw new SubmissionError(result.payload.response.data);
            }

            //Store JWT Token to browser session storage
            //If you use localStorage instead of sessionStorage, then this w/ persisted across tabs and new windows.
            //sessionStorage = persisted only in current tab
            //localStorage.setItem('jwtToken', result.payload.data.token);
            //let other components know that everything is fine by updating the redux` state
            dispatch(signUpUserSuccess(result.payload.data)); //ps: this is same as dispatching RESET_USER_FIELDS
        });
};

const prepareCitiesForOptions = (object, parent) => {
    parent = parent || null
    let preparedOptions = []
    if(object) {
        for (let o of object) {
            // if(o['IBLOCK_SECTION_ID'] === parent) {
                preparedOptions.push( {
                    'value': o.ID,
                    'label': o.NAME
                })
            // }
        }
    }
    return preparedOptions
}

const defaultPaymentTypes = {
    percent:"Процент с бронирования",
    subscriber:"Абонентская плата"
}
class SignUpForm extends Component {
    static contextTypes = {
        router: PropTypes.object
    }

    constructor(props) {
        super(props);
        this.state = {
            paymentTypes: defaultPaymentTypes,
            phoneNoteShow: false
        }

    }

    componentWillMount() {
        //Important! If your component is navigating based on some global state(from say componentWillReceiveProps)
        //always reset that global state back to null when you REMOUNT
        this.props.resetMe()
        this.props.fetchCountries()
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.geocoder && nextProps.geocoder !== this.props.geocoder){
            const { houseNumber } = this.props
            if(houseNumber){
                let point = nextProps.geocoder.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos
                point = point.split(' ').reverse()
                this.props.change('map', point.join(' '))
            }
        }
        // if(this.props.cities !== nextProps.cities && !!nextProps.cities){
        //     if(nextProps.cities.length > 0){
        //
        //     }
        // }
        if (nextProps.user.status === 'authenticated' && nextProps.user.user && !nextProps.user.error) {
            this.context.router.history.push('/lk/');
        }
    }

    prepareOptionsFromObject (object) {
        let preparedOptions = {}
        if(object) {
            for (let o of object) {
                preparedOptions[o.ID] = o.NAME
            }
        }
        return preparedOptions
    }

    renderRegion({ fields, cities, _this, meta: { error, submitFailed } }) {
        if(fields.length === 0){
            fields.push({})
        }
        return(
            <div className="container">
                <label className='control-label active'>Регион/город/населнный пункт*</label>
                <div className="row">
                    {fields.map((field, index) =>
                        <div key={index} className="col-md-4">
                            <Field
                                name={`${field}.id`}
                                component={RenderAutocompleteField}
                                label=""
                                options={prepareCitiesForOptions(cities, fields.get(index) && fields.get(index).parent)}
                                type="text"
                                simpleValue={true}
                                placeholder="Начните вводить название"
                                onChange={event => {
                                    for(let i = fields.length; i > index ; i--){
                                        fields.remove(i)
                                    }
                                    setTimeout(() => {
                                        if(event.value && !fields.get(index+1) && prepareCitiesForOptions(cities, event.value).length) {
                                            fields.push({parent: event.value})
                                        }else{
                                            let curCity = cities.filter((city)=> city.ID === event.value)
                                            curCity = curCity[0]
                                            if(curCity && curCity['UF_PAYMENT_TYPE']) {
                                                _this.setState({paymentTypes: curCity['UF_PAYMENT_TYPE']})
                                            }else{
                                                _this.setState({paymentTypes:defaultPaymentTypes})
                                            }
                                        }
                                    },0)
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        )
    }
    renderPaymentType() {
        const { city, change } = this.props
        const { paymentTypes } = this.state
        const paymentTypesKeys = Object.keys(paymentTypes)
        if( city && paymentTypesKeys.length > 1) {
            return (
                <div className="card warning-color">
                    <div className="card-block">
                        <div className="mb-2">
                            <h3>Выберите тип размещения вашего объекта на сайте</h3>
                        </div>
                        <div>
                            <div>
                                <Field
                                    name="paymentType"
                                    component={renderSelect}
                                    label="Тип размещения"
                                    options={this.state.paymentTypes}
                                />
                            </div>
                            <div>
                                <b>Процент с бронирования</b> - с каждого бронирования через сайт вы платите процент от суммы
                                бронирования<br/>
                                <b>Абонентская плата</b> - оплата за размещение на год независимо от количества бронирований
                            </div>
                        </div>
                    </div>
                </div>
            )
        }else if( city && paymentTypesKeys.length == 1) {
            return (
                <Field
                    name="paymentType"
                    type='hidden'
                    component={renderField}
                    forceValue={paymentTypesKeys[0]}
                />
            )
        }else{
            return <div/>
        }
    }
    changePayment(payment){
        this.props.change('paymentType',payment)
    }
    geocoderResponseToOptions(geocoderResponse){
        if(geocoderResponse){
            const res = geocoderResponse.response.GeoObjectCollection
            //res.metaDataProperty
            //res.featureMember
            if(+(res.metaDataProperty.GeocoderResponseMetaData.found) > 0){
                let options = []
                for(let obj of res.featureMember) {
                  if(obj.GeoObject.metaDataProperty.GeocoderMetaData.kind === 'locality' ||
                      obj.GeoObject.metaDataProperty.GeocoderMetaData.kind === 'district' ||
                      obj.GeoObject.metaDataProperty.GeocoderMetaData.kind === 'house' ||
                      obj.GeoObject.metaDataProperty.GeocoderMetaData.kind === 'street'

                  ){

                       options.push({
                           value: obj.GeoObject.name,
                           label: obj.GeoObject.name + ' ' + obj.GeoObject.description,
                           point:obj.GeoObject.Point.pos
                        })
                  }
                }
                return options
            }else {
                return null;
            }
        }
    }
    renderFieldNote(mes, show){
        if(show){
            return <div className="fieldNote">{mes}</div>
        }else{
            return <div/>
        }
    }
    render() {
        const {address, asyncValidating, handleSubmit, submitting, asyncValidate, validate,invalid,submitFailed, countries, cities, user, goGeocoder,geocoder, region,city, map, country, houseNumber, phone} = this.props
        let geocodeTimeoutID;
        let draggingMapTimeoutID;
        document.title = 'Регистрация - Edem-v-Gosti.ru';
        if(user.status === 'signuped'){
            return (
                <div className='container'>
                    <div className="pageTitle">
                        <h1>Регистрация</h1>
                    </div>
                    <InfoCard
                        title={user.user.message}
                        text="На указанный адрес электронной почты отправлено письмо с инструкциями по подтверждению регистрации. После подтверждения можно будет авторизоваться"
                        link="/lk/login"
                        linkText="Форма авторизации"
                        color="stylish-color-dark white-text"
                        buttonColor="warning"
                    />
                </div>
            )
        }else {
            return (
                <div className='container'>
                    <div className="pageTitle">
                        <h1>Регистрация</h1>
                    </div>
                    <Error error={user.error}/>
                    <form onSubmit={ handleSubmit(validateAndSignUpUser) }>
                        <div className="row">
                            <div className="col-md-12">
                                <Field
                                    name="objectName"
                                    type="text"
                                    component={ renderField }
                                    label="Название объекта*"/>
                            </div>
                            <div className="col-md-4">
                                <Field
                                    name="type"
                                    component={ renderSelect }
                                    label="Тип объекта*"
                                    options={{
                                        'Выберите': 'Выберите',
                                        'Гостевой дом':'Гостевой дом',
                                        'Частный сектор':'Частный сектор',
                                        'Мини-гостиница':'Мини-гостиница',
                                        'Гостиница':'Гостиница',
                                        'Отель':'Отель',
                                        'Курортный отель':'Курортный отель',
                                        'Мини-отель':'Мини-отель',
                                        'МотельХостел':'МотельХостел',
                                        'Апарт-отель':'Апарт-отель',
                                        'Кемпинг':'Кемпинг',
                                        'Автокемпинг':'Автокемпинг',
                                        'Бунгало':'Бунгало',
                                        'Шале':'Шале',
                                        'Бутик-отель':'Бутик-отель',
                                        'Вилла':'Вилла',
                                        'Замок':'Замок'
                                    }}
                                />
                            </div>
                            <div className="col-md-4">
                                <Field
                                    name="country"
                                    component={ renderSelect }
                                    label="Cтрана*"
                                    options={this.prepareOptionsFromObject(countries)}
                                    onChange={event => {
                                        this.props.change('city', '')
                                        this.props.change('phone', '');
                                        this.props.fetchCities(event.target.value)
                                    }}
                                />
                            </div>
                            <div className="col-md-4">
                                <Field
                                    isCreatable={true}
                                    promptTextCreator={label => label}
                                    name="city"
                                    component={ RenderAutocompleteField }
                                    label="Город*"
                                    type="text"
                                    placeholder="Начните вводить название города"
                                    noResultsText='Ничего не найдено'
                                    options={prepareCitiesForOptions(cities)}
                                    // filterOption={(option,filter) => {
                                    //      return true
                                    //  }}
                                    onChange={(event)=>{
                                        let curCity = cities.filter((city)=> city.ID === event.value)
                                        curCity = curCity[0]
                                        if(curCity && curCity['UF_PAYMENT_TYPE'] && curCity['UF_PAYMENT_TYPE'].length) {
	                                        this.setState({paymentTypes: curCity['UF_PAYMENT_TYPE']})
	                                        this.changePayment(Object.keys(curCity['UF_PAYMENT_TYPE'])[0])
                                        }else{
                                            this.setState({paymentTypes:defaultPaymentTypes})
                                            this.changePayment(Object.keys(defaultPaymentTypes)[0])
                                        }
                                    }}
                                />
                            </div>
                            {/*<FieldArray name="region" component={this.renderRegion} cities={cities} _this={this}/>*/}
                            <div className="col-md-9">
                                <Field
                                    isCreatable={true}
                                    promptTextCreator={label => label}
                                    name="address"
                                    component={ RenderAutocompleteField }
                                    label="Адрес*"
                                    type="text"
                                    disabled={!city}
                                    onInputChange={(newVal)=>{
                                        clearTimeout(geocodeTimeoutID)
                                        if(newVal.length > 2) {
                                            geocodeTimeoutID = setTimeout(()=>{
                                                for(let c of countries){
                                                    if(c.ID === country){
                                                        goGeocoder(c.NAME + ', ' + city.label +', ' + newVal)
                                                        break
                                                    }
                                                }
                                            },500)
                                        }
                                        return newVal
                                    }}
                                    onChange={(obj) => {
                                        if(obj.point) {
                                            let point = obj.point.split(' ').reverse()
                                            this.props.change('map', point.join(' '))
                                        }else {
	                                        for(let c of countries){
		                                        if(c.ID === country){
			                                        goGeocoder(c.NAME + ', ' + city.label + ', ' + obj.value).then(res => {
			                                          let point = res.payload.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ').reverse()
				                                        this.props.change('map', point.join(' '))
                                              })
			                                        break
		                                        }
	                                        }
                                        }
                                    }}
                                    placeholder="Начните вводить название улицы"
                                    options={this.geocoderResponseToOptions(geocoder)}
                                    noResultsText='Ничего не найдено'
                                    filterOption={(option,filter) => {
                                        return true
                                    }}
                                />
                            </div>
                            <div className="col-3">
                                <Field
                                    name="roomsCount"
                                    component={renderField}
                                    label="Количество номеров*"
                                    type="text"
                                    // disabled={!address}
                                    normalize={val => val.replace(/[^\d]/g, '')}
                                    // onChange={(e)=>{
                                    //     const newVal = e.target.value
                                    //     clearTimeout(geocodeTimeoutID)
                                    //     if(newVal.length > 0) {
                                    //         geocodeTimeoutID = setTimeout(()=>{
                                    //             for(let c of countries){
                                    //                 if(c.ID === country){
                                    //                     goGeocoder(c.NAME + ', ' + city.label +', ' + address.value +', ' + newVal)
                                    //                     break
                                    //                 }
                                    //             }
                                    //         },500)
                                    //     }
                                    //     return newVal
                                    // }}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className='col-md-4' ref='mapContainer'>
                                <YandexMap blocked={!address} center={map} blockedMessage="Сначала введите адрес"
                                           controls={[]}
                                           onActiontickcomplete={(e) => {
                                               const newCenter = e.get('tick').globalPixelCenter
                                               const ymap = e.originalEvent.target
                                               const projection = ymap.options.get('projection')
                                               const converter = new Api.api.map.Converter(ymap)
                                               let newPoint = projection.fromGlobalPixels(newCenter, ymap.getZoom())
                                               let oldPointArr = this.props.map.split(' ')
                                               if( (+(oldPointArr[0])).toFixed(5)!== newPoint[0].toFixed(5) &&
                                                   (+(oldPointArr[1])).toFixed(5)!== newPoint[1].toFixed(5)) {
                                                   this.props.change('map', newPoint.join(' '))
                                               }
                                           }}
                                           onActiontick={(e)=>{
                                               clearTimeout(draggingMapTimeoutID)
                                               this.refs.mapContainer.classList.add('dragged')

                                           }}
                                           onActionend={(e)=> {
                                               draggingMapTimeoutID = setTimeout(()=> {
                                                   this.refs.mapContainer.classList.remove('dragged')
                                               },300)
                                           }}
                                    />
                                <Field
                                    name='map'
                                    type='hidden'
                                    component='input'/>
                            </div>
                            <div className="col-md-6">
                                <div className="card warning-color">
                                    <div className="card-block">
                                        Если флажок на карте поставлен неверно, вы можете его перетащить
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-md-6">
                                <Field
                                    name="email"
                                    type="email"
                                    component={ renderField }
                                    label="Email (Будет вашим логином)*"/>
                            </div>
                            <div className="col-md-6">
                                <Field
                                    name="phone"
                                    type="text"
                                    component={ renderField}
                                    label="Мобильный телефон*"
                                    normalize={normalizePhone(getPhoneCode(country, countries))}
                                    onBlur={(e)=>{
                                        this.state.phoneNoteShow = true
                                    }}
                                />
                                {this.renderFieldNote('Внимательно проверьте номер телефона', this.state.phoneNoteShow)}
                            </div>
                            <div className="col-md-6">
                                <Field
                                    name="name"
                                    type="text"
                                    component={ renderField }
                                    label="Имя*"/>
                            </div>
                            <div className="col-md-6">
                                <Field
                                    name="lastname"
                                    type="text"
                                    component={ renderField }
                                    label="Фамилия*"/>
                            </div>
                            <div className="col-md-6">
                                <Field
                                    name="password"
                                    type="password"
                                    component={ renderField }
                                    label="Пароль*"/>
                            </div>
                            <div className="col-md-6">
                                <Field
                                    name="confirmPassword"
                                    type="password"
                                    component={ renderField }
                                    label="Повторить пароль*"/>
                            </div>
                        </div>
                        {this.renderPaymentType()}

                        <div className="help-block mt-1 mb-1" style={{lineHeight:'3rem'}}>
                            {submitFailed && invalid && 'Проверьте правильность заполнения полей формы'}
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={ submitting }>
                                Отправить
                            </button>
                            <Link
                                to="/lk/login"
                                className="btn btn-default"> Уже есть аккаунт? Войти
                            </Link>
                            <a href="https://edem-v-gosti.ru/forms/add_ob.php" target="_blank" className="btn btn-info">У меня нет Email, что делать?</a>
                        </div>
                    </form>
                    <Loader loading={user.loading}/>
                </div>
            )
        }
    }
}

SignUpForm = reduxForm({
    form: 'SignUpForm', // a unique identifier for this form
    fields:['country', 'city'],
    validate, // <--- validation function given to redux-form
    asyncValidate,
    enableReinitialize: true
})(SignUpForm)

// Decorate with connect to read form values
const selector = formValueSelector('SignUpForm') // <-- same as form name
SignUpForm = connect(state => {
    const address = selector(state, 'address');
    const country = selector(state, 'country');
    const houseNumber  = selector(state, 'houseNumber');
    const city  = selector(state, 'city');
    const phone = selector(state, 'phone');
    const paymentType = selector(state, 'paymentType');
    let  region ='';
    for(let i=0; i<4;i++){
        let regionValue = selector(state, `region[${i}].id`);
        if(regionValue) {
            region += regionValue.label + ', '
        }
    }

    const map = selector(state, 'map');
    return {
        houseNumber,
        country,
        address,
        region,
        map,
        city,
        phone,
        paymentType
    }
})(SignUpForm)

export default SignUpForm