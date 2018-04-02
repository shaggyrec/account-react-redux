import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { reduxForm, Field, FieldArray, SubmissionError } from 'redux-form'
import renderField from '../formFields/renderField'
import renderTextArea from '../formFields/renderTextArea'
import ContractDataFill from './ContractDataFill'
import Modal from '../modal'
import Loader from "../utils/Loader";



class Contract extends Component {
    constructor(props){
        super(props)
        this.contractSign = this.contractSign.bind(this)
        this.handleModalOk = this.handleModalOk.bind(this)
	      this.state = {
        	loading: false
	      }
    }
    componentWillMount() {
        let token = localStorage.getItem('jwtToken');
        //if (!token || token === '') {return;}
        const {objectId, user:{user}, fetchObject, fetchContractData, change} = this.props
        const { object } = this.props.activeObject
        if( !object || +(object.ID) !== +(objectId)) {
            fetchObject(objectId, token);
        }
        if(user.group === 'admin') {
            fetchContractData(objectId, token)
        }
    }
    componentWillUpdate(nextProps, nextState){

    }
    componentWillReceiveProps(nextProps) {
        if (!nextProps.contract.error && nextProps.contract.message) {
            let token = localStorage.getItem('jwtToken');
            //this.context.router.history.push('/lk/');
            this.props.fetchObject(this.props.objectId, token);
        }
    }
    renderContractPdf(objectId) {
        if(objectId) {
            const token = localStorage.getItem('jwtToken');
            return (
                <object data={`https://test.edem-v-gosti.ru/lk/api/contract/?id=${objectId}&token=${token}`} type='application/pdf' width='100%' height='500px'>
                    <a href={`https://test.edem-v-gosti.ru/lk/api/contract/?id=${objectId}&token=${token}`}>Договор</a>
                </object>
            )
        }else{
            return <div />
        }
    }

    contractSign(e) {
        const {signContract, activeObject : {object}} = this.props
        signContract(object.ID).then(res => this.setState({loading:false}))
    }

    handleModalOk(){
        let token = localStorage.getItem('jwtToken');
        this.props.ResetMe()
        this.props.fetchObject(this.props.objectId,token)
    }
    renderBreadCrumbs(name){
        return (
            <nav className="breadcrumb">
                <Link className="breadcrumb-item" to="/lk/contracts">Договоры</Link>
                <span className="breadcrumb-item active">Договор {name}</span>
            </nav>
        )

    }
    render() {
        const { object } = this.props.activeObject
        const objectName = object ? object.NAME.replace(/&quot;/g, '\"'):''
        const stage = object && object.PROPS.CONTRACT_STAGE.VALUE
        const {handleSubmit, submitting, sendContract, user, contract } = this.props
	      let localLoading = false
        document.title = `Договор ${objectName}`

        if(object && (!stage || stage === 'N')) {
            if(user.user.group === 'admin'){
                return (
                    <div>
                        {this.renderBreadCrumbs(objectName)}
                        <h4>Клиент здесь ещё не был.</h4>
                    </div>
                )
            }else {
                return (
                    <div>
                        {this.renderBreadCrumbs(objectName)}
                        <h4>Договор не заключён, заполните необходимые данные</h4>
                        <ContractDataFill {...this.props} handleSubmit={handleSubmit} onSubmit={sendContract}
                                          contractsData={user.user && user.user.contractsData}/>
                    </div>
                )
            }
        }else if(stage === 'P'){
            if(user.user.group === 'admin'){
                return (
                    <div>
                        {this.renderBreadCrumbs(objectName)}
                        <h4>Пользователь назаполнял. Проверь, и проставь сумму</h4>
                        <ContractDataFill {...this.props} handleSubmit={handleSubmit} onSubmit={sendContract} contractsData={user.user && user.user.contractsData}/>
                    </div>
                )
            }else {
                return (
                    <div>
                        {this.renderBreadCrumbs(objectName)}
                        <h4>Договор составляется. Скоро вы получите уведомление, после чего нужно будет согласиться с условиями</h4>
                    </div>
                )
            }
        }else if(stage === 'S'){
            if(user.user.group === 'admin'){
                return (
                    <div>
                        {this.renderBreadCrumbs(objectName)}
                        <div className="alert alert-danger">
                            <h5>Договор ещё не подтвержден клиентом</h5>
                        </div>
                        {this.renderContractPdf(object && object.ID)}
                    </div>
                )
            }else{
                return (
                    <div>
                        {this.renderBreadCrumbs(objectName)}
                        <h5>Ознакомтесь с условиями и нажмите на кнопку внизу, если согласны с ними</h5>
                        {this.renderContractPdf(object && object.ID)}
                        <button onClick={() => {this.setState({loading:true});this.contractSign()}} className="btn btn-warning">Принимаю условия договора</button>
                        <Modal show={ !!contract.contract.message } onOk={this.handleModalOk}>{contract.contract.message}</Modal>
	                      <Loader loading={this.state.loading}/>
                    </div>
                )
            }
        }else{
            return (
                <div>
                    {this.renderBreadCrumbs(objectName)}
                    {this.renderContractPdf(object && object.ID)}
                </div>
            )
        }
    }
}

export default reduxForm({
    form: 'Contract',
    enableReinitialize: true
})(Contract)