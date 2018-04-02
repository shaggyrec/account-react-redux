import React, { Component } from 'react'
import { reduxForm, Field, FieldArray, SubmissionError } from 'redux-form'
import renderField from '../formFields/renderField'
import renderTextArea from '../formFields/renderTextArea'
import renderSelect from '../formFields/renderSelect'
import renderFileInput from '../formFields/renderFileInput'
import Loader from '../utils/Loader'
import Modal from '../modal'

const validate = (values) => {
    let errors = {};
    let hasErrors = false;
    if (!values.name || values.name.trim() === '') {
        errors.name = 'Введите имя';
        hasErrors = true;
    }
    return hasErrors && errors
}
const natural = value => +(value) < 0 ? 'В минус фирму вогнать хочешь?' : undefined
const onlyNumbers = (value, previousValue, allValues) => value.replace(/[^\d]/g, '')
const tenSymbols = value =>
    value && value.length !== 10 ? 'Должно быть 10 символов' : undefined
const twelveSymbols = value =>
    value && value.length !== 12 ? 'Должно быть 12 символов' : undefined
const required = value => value ? undefined : 'Заполните это поле'

class ContractDataFill extends  Component {

    constructor(props){
        super(props);
        this.state = {
            type:'individual',
            documentScan:'',
            id: 0
        }
        this.handleSavedChoose = this.handleSavedChoose.bind(this)
        this.handleTypeChange = this.handleTypeChange.bind(this)
        this.findByInn = this.findByInn.bind(this)
        this.clearDocumentScan = this.clearDocumentScan.bind(this)
        this.handleModalOk = this.handleModalOk.bind(this)
        this.renderEntityInfo = this.renderEntityInfo.bind(this)
    }
    componentWillMount(){
        const { contract:{contract:{contractData}} } = this.props
        this.fillContractData(contractData)
    }
    componentWillUpdate(nextProps, nextState){
        const { contract:{innSearchResults, contract:{contractData}}, change } = nextProps
         const prevContractData = this.props.contract.contract.contractData
         if (contractData && prevContractData !== contractData) {
            this.fillContractData(contractData)
        //
        //     this.setState({
        //         type:contractData['type'],
        //         id:contractData['id'],
        //         documentScan: contractData['documentScan']
        //     })
        //     for(let item in contractData){
        //          change(item, contractData[item]);
        //     }
         }
        if(!nextState.id && innSearchResults.suggestions && innSearchResults.suggestions.length > 0) {

            const suggestion = innSearchResults.suggestions[0].data
            this.fillForm({
                name: suggestion.name.full_with_opf,
                kpp: suggestion.kpp,
                okpo: suggestion.okpo || '',
                ogrn: suggestion.ogrn,
                legalAddress: suggestion.address.value
            })
        }
    }
    fillContractData(contractData){
        const { change } = this.props
        if (contractData) {
            this.setState({
                type:contractData['type'],
                id:contractData['id'],
                documentScan: contractData['documentScan']
            })
            for(let item in contractData){
                change(item, contractData[item]);
            }
        }
    }
    renderFields(){
        const type = this.state.type
        if(type === 'individual') {
            return (
                <div className="row">
                    <Field
                        component={renderField}
                        type="hidden"
                        name="id"
                    />
                    <div className="col-sm-4">
                        <Field
                            component={renderField}
                            type="text"
                            name="name"
                            label='Имя'
                            validate={required}
                        />
                    </div>
                    <div className="col-sm-4">
                        <Field
                            component={renderField}
                            type="text"
                            name="lastName"
                            label='Фамилия'
                            validate={required}
                        />
                    </div>
                    <div className="col-sm-4">
                        <Field
                            component={renderField}
                            type="text"
                            name="secondName"
                            label='Отчество' validate={required}/>
                    </div>
                    <div className="col-sm-4">
                        <Field
                            component={renderField}
                            type="date"
                            name="birth"
                            label='Дата рождения' validate={required}/>
                    </div>
                    <div className="col-sm-4">
                        <Field
                            component={renderField}
                            type="text"
                            name="address"
                            label='Адрес регистрации' validate={required}/>
                    </div>
                    <div className="col-sm-4">

                    </div>
                    <div className="col-sm-4">
                        <Field
                            component={renderField}
                            type="text"
                            name="passportNumber"
                            label='Серия и номер паспорта' validate={required}/>
                    </div>
                    <div className="col-sm-4">
                        <Field
                            component={renderField}
                            type="date"
                            name="passportDate"
                            label="Дата выдачи" validate={required}/>
                    </div>
                    <div className="col-sm-4">
                        <Field
                            component={renderField}
                            type="text"
                            name="passportOrg"
                            label='Кем выдан' validate={required}/>
                    </div>
                    <div className="col-12">
                        {this.renderDocumentScanInput()}
                    </div>
                </div>
            )
        }else {
            let validate = [required]
            if(type === 'entrepreneur'){
                validate.push(twelveSymbols)
            }else{
                validate.push(tenSymbols)
            }
            return (
                <div>
                    <div className="row">
                        <div className="col-sm-4">
                            <Field
                                ref="innField"
                                component={renderField}
                                type="text"
                                name="inn"
                                label='ИНН'
                                normalize={onlyNumbers}
                                onChange={this.findByInn}
                                validate={validate}
                            />
                        </div>
                    </div>
                    {this.renderEntityInfo()}
                </div>
                )

        }
    }

    renderEntityInfo(){
        const { contract:{innSearchResults} } = this.props
        const suggestions = innSearchResults.suggestions
        if(innSearchResults.loading){
            return <div>Поиск</div>
        }else if((this.state.id) || (suggestions && suggestions.length > 0)){
            // const suggestion = suggestions[0].data
            // this.fillForm ( {
            //     name: suggestion.name.full_with_opf,
            //     kpp:suggestion.kpp,
            //     okpo: suggestion.okpo,
            //     ogrn: suggestion.ogrn,
            //     legalAddress:suggestion.address.value
            // })
            return (
                <div>
                    <div className="row">
                        <Field
                            component={renderField}
                            type="hidden"
                            name="id"
                        />
                        <div className="col-sm-4">
                            <Field
                                component={renderField}
                                type="text"
                                name="name"
                                label='Название'
                                disabled={true}
                                validate={required}
                            />
                        </div>
                        <div className="col-sm-4">
                            <Field
                                component={renderField}
                                type="text"
                                name="legalAddress"
                                label='Юридический адрес'
                                disabled={true}
                                validate={required}
                            />
                        </div>
                        {this.renderKpp()}
                        <div className="col-sm-4">
                            <Field
                                component={renderField}
                                type="text"
                                name="ogrn"
                                label='ОГРН'
                                disabled={true}
                                validate={required}

                            />
                        </div>
                        <div className="col-12">
                            {this.state.type === 'entrepreneur' ? this.renderDocumentScanInput() : ''}
                        </div>
                    </div>
                </div>
            )
        }
    }
    renderKpp(){
        if(this.state.type === 'entity') {
            return (
                <div className="col-sm-4">
                    <Field
                        component={renderField}
                        type="text"
                        name="kpp"
                        label='КПП'
                        disabled={true}
                        validate={required}
                    />
                </div>
            )
        }
    }
    findByInn(e){
        const { FetchOrganizationByInn } = this.props
        const inn = e.target.value
        this.clearForm()
        if(this.isValidInn(inn)) {
            FetchOrganizationByInn(inn)
        }
    }

    isValidInn(inn){
        const type = this.state.type
        const validEntrepreneur = type === 'entrepreneur' && inn.length === 12
        const validEntity = type === 'entity' && inn.length === 10
        return validEntity || validEntrepreneur
    }

    renderDocumentScanInput(){
        if(this.state.documentScan) {
            return (
                <div className="mb-1">
                    <h5>Скан документа</h5>
                    <div>
                        <img style={{maxWidth:'100%'}} src={`https://test.edem-v-gosti.ru${this.state.documentScan}`}/>
                        <Field
                            component={renderField}
                            type='hidden'
                            name='documentScan'
                            value={this.state.documentScan}
                            validate={required}
                        />
                    </div>
                    <button className="btn btn-warning" onClick={this.clearDocumentScan}>Загрузить другой скан</button>
                </div>
            )
        }else {
            return (
                <Field
                    component={renderFileInput}
                    label="Загрузите скан документа"
                    name="documentScan"
                    validate={required}
                />
            )
        }
    }
    clearDocumentScan(e){
        this.setState({documentScan:''})
    }
    renderChanger(){
        return(
            <Field
                ref="typeField"
                component={renderSelect}
                label=""
                onChange={this.handleTypeChange}
                name="type"
                options={{
                    individual:'Физическое лицо',
                    entrepreneur:'ИП',
                    entity:'Юридическое лицо'
                }}
                disabled={!!this.state.id}

            />
        )
    }
    handleTypeChange(e) {
        const type = e.target.value
        this.setState({
            type: type
        })
        this.props.ResetSuggestions()
        if(type == 'individual'){
            this.clearForm()
            this.fillForm(this.props.initialValues)
        }else{
            this.clearForm()
        }
    }

    renderSavedContractsList(data){
        if(!data){
             return <div/>
        }
        return(
                <div className="md-form">
                    <h5 className="mb-0">или выберите ранее заполненные:</h5>
                    <select className="form-control mt-0" onChange={this.handleSavedChoose}>
                        <option value=''>Новый</option>
                        {this.renderSavedContractsListOptions(data)}
                    </select>
                </div>
            )
    }
    renderSavedContractsListOptions(data){
        if(data && data.length > 0){
            return data.map(item => (
                <option key={`SavedContracts${item.id}`} value={item.id}>{item.name} {item.lastName}</option>
            ))
        }
    }

    handleSavedChoose(e){
        const { contractsData, change, initialValues } = this.props
        const cur = e.target.value
        if(cur) {

            for(let item of contractsData)
                if(item.id == cur) {
                    this.setState({id: item.id})
                    change('id',item.id)
                    change('type', item.type)
                    this.setState({
                        type:item.type,
                        documentScan:item.documentScan,
                        // savedContract: cur
                    })
                    this.fillForm(item)
                }
        }else{
            const { change } = this.props
            this.setState({id: 0})
            this.clearDocumentScan()
            change('id',0)
            change('inn','')
            change('name',initialValues.name)
            change('lastName',initialValues.lastName)
            change('secondName',initialValues.secondName)
            change('birth',initialValues.birth)
            change('documentScan','')
            change('address',initialValues.address)
            change('passportDate', initialValues.passportDate)
            change('passportNumber',initialValues.passportNumber)
            change('passportOrg',initialValues.passportOrg)
        }
    }
    fillForm(fields){
        const { change} = this.props
        //console.log(fields.name)
        //this.clearForm()
        for(let fieldName in fields){
            change(fieldName,fields[fieldName])
        }
    }
    clearForm(){
        const { change} = this.props
        change('id',0)
        change('name','')
        change('lastName','')
        change('secondName','')
        change('birth','')
        change('documentScan','')
        change('address','')
        change('passportDate', '')
        change('passportNumber','')
        change('passportOrg','')
        change('inn','')
        change('kpp','')
        change('ogrn','')
        change('legalAddress','')
    }
    handleModalOk(){
        let token = localStorage.getItem('jwtToken');
        this.props.ResetMe()
        this.props.fetchObject(this.props.objectId,token)
    }
    renderPriceInput(){
        const { user:{user}, activeObject: {object} } = this.props
        if(user.group === 'admin'){
            return (
                <div>
                    <h5>{object ? object.PROPS.PAYMENT_TYPE.VALUE : ''}</h5>
                    <div className="row">
                        <div className="col-sm-4">
                            <Field
                                component={renderField}
                                type='number'
                                name='CONTRACT_PRICE'
                                label={object && object.PROPS.PAYMENT_TYPE.VALUE === 'Процент с бронирования' ? 'Процент':'Сумма размещения'}
                                validate={[natural, required]}
                            />
                        </div>
                    </div>
                </div>
            )
        }else{
            return <div />
        }
    }
    render () {
        const { handleSubmit, onSubmit, contractsData, submitting, contract } = this.props
        return(
            <div>
                <form onSubmit={ handleSubmit(onSubmit)} onChange={this.validate}>
                    <div className="row mt-2">
                        <div className="col-sm-4">
                            {this.renderSavedContractsList(contractsData)}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-4">
                            {this.renderChanger()}
                        </div>
                    </div>
                    {this.renderFields()}
                    {this.renderPriceInput()}
                    <div>
                        <button className={`btn ${submitting ? 'btn-success' :'btn-warning'}`} disabled={submitting}>{submitting ? 'Отправляю...' : 'Отправить'}</button>
                    </div>
                    <Loader loading={submitting}/>
                </form>
                <Modal show={ !!contract.contract.message } onOk={this.handleModalOk}>{contract.contract.message}</Modal>
            </div>
        )
    }
}
export default ContractDataFill