import React, {Component} from 'react'
import PropTypes from  'prop-types'
import {Link} from 'react-router-dom'
import Error from  '../utils/Error'
import Loader from '../utils/Loader'
import renderFileInput from '../formFields/renderFileInput'
import renderTextArea from '../formFields/renderTextArea'
import {reduxForm, Field, FieldArray, SubmissionError} from 'redux-form'
import InfoCard from '../utils/InfoCard'
import Modal from '../modal'

const validate = (values) => {
    let errors = {}
    let hasErrors = false

    if (!values.message || values.message.trim() === '') {
        errors.message = 'Напишите ваш вопрос';
        hasErrors = true;
    }
    return hasErrors && errors;
}

class Feedback extends Component {
    constructor(props){
        super(props)
        this.handleCall = this.handleCall.bind(this)
        this.handleModalOk = this.handleModalOk.bind(this)
        this.handleModalClose = this.handleModalClose.bind(this)
        this.state = {showModal:false}
    }
    componentWillMount() {
        this.props.resetMe()
    }

    handleCall(e){
        this.setState({showModal:true})
    }
    handleModalOk(){
        this.props.sendRequest()
    }
    handleModalClose(){
        this.setState({showModal:false})
    }
    renderModal(){
        if(this.state.showModal){
            return(
                <Modal show={true} onOk={this.handleModalOk} btnOkText='Да' btnCloseText='Нет' onClose={this.handleModalClose}>
                    Заказать звонок менеджера?
                </Modal>
            )
        }else{
            return <div />
        }
    }


    render() {
        const {handleSubmit, submitting, sendMessage, sendRequest} = this.props
        const {message, error, loading} = this.props.feedback
        document.title = 'Обращение в службу поддержки'
        if (message) {
            return <InfoCard
                title="Вопрос отправлен"
                text={message}
                color="warning-color"/>
        } else {
            return (
                <div>
                    <form onSubmit={ handleSubmit(sendMessage) }>
                        <div className="card grey lighten-3">
                            <div className="card-block">
                                <h1>Обращение в службу поддержки</h1>
                                <Error error={error}/>
                                <Field
                                    component={renderTextArea}
                                    name="message"
                                    label="Ваш вопрос"
                                />
                                <Field
                                    component={renderFileInput}
                                    name="file"
                                    label="Файл"
                                />
                                <button type="submit" className="btn red">Отправить</button>
                            </div>
                        </div>
                        <div className="card grey lighten-3 mt-1">
                            <div className="card-block">
                                <h4>или отправьте запрос на звонок, сотрудник тех. поддержки свяжется с вами в ближайшее
                                    время</h4>
                                <br/>
                                <button type="button" className="btn red" onClick={this.handleCall}>Отправить запрос</button>
                            </div>
                        </div>
                    </form>
                    {this.renderModal()}
                </div>
            )
        }
    }
}

export default reduxForm({
    form: 'Feedback', // a unique identifier for this form
    validate, // <--- validation function given to redux-form
    //asyncValidate,
    enableReinitialize: true
})(Feedback)