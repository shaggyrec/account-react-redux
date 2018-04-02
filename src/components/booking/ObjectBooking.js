import React, {Component} from 'react'
import {reduxForm, Field, FieldArray} from 'redux-form'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // ES6
import renderField from '../formFields/renderField'
import renderSelect from '../formFields/renderSelect'
import renderCheckBox from '../formFields/renderFieldCheckBox'
import './style.css'
import Modal from '../modal'
class ObjectBooking extends Component {
    constructor(props) {
        super(props);
        this.acceptAction = this.acceptAction.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.changeScrollBarView = this.changeScrollBarView.bind(this)
        this.handleScroll = this.handleScroll.bind(this)
        this.state = {
            showPanel: false,
            dateType: false,
            dateFrom: false,
            dateTo: false,
            status: {},
            keywords: '',
            showModal: false,
            showAlert: false,
            actionItem: false,
            answerText: ''
        }
    }

    acceptAction(action, actionItem) {
        this.setState({showModal: action, actionItem: actionItem})
    }

    modalClose() {
        this.setState({showModal: false, actionItem: false, showAlert: false})
    }

    processAction() {
        if (this.state.showModal == 'C' && !this.state.answerText) {
            this.setState({showModal: false, actionItem: false, showAlert: true});
            return;
        }
        this.props.setOrderStatus(this.state.actionItem, this.state.showModal, this.state.answerText, localStorage.getItem('jwtToken'));
        if (this.state.showModal == 'A') {
            this.props.notify('На Вашу почту отправлено письмо с подробностями по данному бронированию.');
        }
        this.setState({showModal: false, actionItem: false})
    }

    renderAlert() {
        let isShow = this.state.showAlert;
        return <Modal
            show={isShow}
            onOk={() => {
                this.modalClose()
            }}
            btnOkText="Понятно"
        ><p>Поле "Причина" не может быть пустым</p></Modal>
    }

    renderModal() {
        let message = [];
        let action = this.state.showModal;
        switch (action) {
            case 'A':
                message.push(
                    <p>
                        Вы уверены, что хотите подтвердить заявку на бронирование?
                    </p>
                );
                break;
            case 'C':
                message.push(
                    <p>Вы уверены, что хотите отменить заявку на бронирование?</p>
                );
                break;
            case 'F':
                message.push(
                    <p>Вы уверены, что хотите установить заявке статус "Незаезд"?</p>
                );
                break;
            case 'RT':
                message.push(
                    <p>Вы уверены, что хотите отменить бронирование? (в этом случае на email гостя придет письмо, с
                        просьбой подтвердить указанную Вами причину.)</p>
                );
                break;
        }
        let tArea = '';
        if (action == 'C' || action == 'RT') {
            tArea = (<div><b>Причина:</b>*<textarea id="reject_cause" onChange={(e) => {
                this.setState({answerText: e.target.value});
            }}></textarea><b>* - обязательно для заполнения!</b></div>);
        }
        return <Modal
            show={!!action}
            onOk={() => {
                this.processAction()
            }}
            onClose={() => {
                this.modalClose()
            }}
            btnOkText="Подтвердить"
            btnCloseText="Отмена"
        >{message}{tArea}</Modal>
    }

    handleScroll(e, evt) {
        const target = e.currentTarget
        const offset = target.scrollLeft
        const feedId = target.getAttribute('data-scroll')
        const feed = this.refs[feedId]
        feed.scrollLeft = offset
    }

    changeScrollBarView(e, evt) {
        const eventType = e.type
        const target = e.currentTarget
        const feedWidth = target.querySelector('.booking_feed').clientWidth
        const scrollBarId = target.getAttribute('data-scrollbar')
        const scrollBar = this.refs[scrollBarId]
        const scrollBarWrapper = scrollBar.parentNode
        scrollBar.style.width = feedWidth + 'px'
        if (eventType === 'mouseleave') {
            scrollBarWrapper.classList.remove('show')
            return
        }
        scrollBarWrapper.classList.add('show')
        const windowScroll = window.scrollY
        const windowHeight = window.innerHeight
        const targetOffset = target.getBoundingClientRect()
        const targetTop = targetOffset.top + windowScroll
        const targetYposition = +(targetTop) + (target.clientHeight)
        scrollBarWrapper.style.left = targetOffset.left + 'px'
        scrollBarWrapper.style.right = window.innerWidth - targetOffset.left - target.clientWidth - (window.innerWidth * 0.025) + 'px'
        if (targetTop + 100 < windowHeight + windowScroll && targetYposition - 20 > windowHeight + windowScroll) {
            scrollBarWrapper.classList.add('show')
        } else {
            scrollBarWrapper.classList.remove('show')
        }

    }

    componentWillUnmount() {
        this.props.cleanOrders();
    }

    componentWillMount() {
        let token = localStorage.getItem('jwtToken');
        //  if (!token || token === '') {return;}
        const {object} = this.props.activeObject;
        const {orders, limit} = this.props;
        if (!object || +(object.ID) !== +(this.props.objectId)) {
            this.props.fetchObject(this.props.objectId, token);
        } else if (!orders) {
            this.props.fetchOrders(this.props.objectId, token, object.PROPS.PAYMENT_TYPE.VALUE_XML_ID == 'percent' ? true : false);
        }
    }

    renderTable() {
        let orders = this.props.orders.RESULT;
        if (!this.props.activeObject || !this.props.activeObject.object) {
            return (<div></div>);
        }
        let paymentType = this.props.activeObject.object.PROPS.PAYMENT_TYPE;
        let html = [];
        let {mode, statusList} = this.props;
        for (let key in orders) {
            let order = orders[key];
            //let transfer = order.TRANSFER == "Y" ? 'fa fa-check-square-o fa-lg mr-1' : 'fa fa-square-o fa-lg mr-1';
            switch (paymentType.VALUE_XML_ID) {
                case 'subscriber':
                    if (orders[key].hasOwnProperty('ITEMS')) {
                        for (let item in orders[key].ITEMS) {
                            let basketItem = orders[key].ITEMS[item];
                            let countLabel = order.MAN_COUNT + (parseInt(order.MAN_COUNT) == 1 ? ' взрослый' : ' взрослых');
                            if (parseInt(order.CHILD_COUNT)) {
                                countLabel += '+ ' + order.CHILD_COUNT + (parseInt(order.CHILD_COUNT) == 1 ? ' ребенок' : (parseInt(order.CHILD_COUNT) < 5 ? ' ребенка' : ' детей'));
                            }
                            let userName = order.USER_LAST_NAME ? order.USER_LAST_NAME : '';
                            userName += order.USER_NAME ? ' ' + order.USER_NAME : '';
                            userName += order.USER_SECOND_NAME ? ' ' + order.USER_SECOND_NAME : '';
                            html.push(
                                <tr key={basketItem.ID}>
                                    <td>{basketItem.ORDER_DATE_CREATE}</td>
                                    <td>
                                        {userName}
                                        <br/>
                                        <small>{countLabel}</small>
                                        <br/>
                                    </td>
                                    <td>{order.USER_EMAIL}</td>
                                    <td>{order.USER_PHONE}</td>
                                    <td>{basketItem.DATE_FROM}</td>
                                    <td>{basketItem.DATE_TO}</td>
                                    <td>{basketItem.NAME}</td>
                                    <td><i className="fa fa-rub fa-lg"></i> {basketItem.PRICE}</td>
                                </tr>
                            );
                        }
                    }
                    break;
                default:
                    if (orders[key].hasOwnProperty('ITEMS')) {
                        for (let item in orders[key].ITEMS) {
                            let basketItem = orders[key].ITEMS[item];
                            let action = '';
                            if (mode == 'full') {
                                action = (<td></td>);
                            }
                            if (mode == 'full') {
                                if (basketItem.ORDER_STATUS == 'N') {
                                    action = (
                                        <td>
                                            <button className="btn btn-success btn-sm btn-block cursor-pointer"
                                                    onClick={() => this.acceptAction('A', order.ORDER_ID)}>
                                                Подтвердить
                                            </button>
                                            <button className="btn btn-danger btn-sm btn-block cursor-pointer"
                                                    onClick={() => this.acceptAction('C', order.ORDER_ID)}>Отказ
                                            </button>
                                        </td>);
                                } else if (basketItem.IS_COMING && basketItem.ORDER_STATUS == 'IN') {
                                    action = (
                                        <td>
                                            <button className="btn btn-danger btn-sm btn-block cursor-pointer"
                                                    onClick={() => this.acceptAction('F', order.ORDER_ID)}>Незаезд
                                            </button>
                                        </td>);
                                }
                                else if (basketItem.ORDER_STATUS == 'A') {
                                    action = (<td>
                                        <button className="btn btn-blue-grey btn-sm btn-block cursor-pointer"
                                                onClick={() => this.acceptAction('RT', order.ORDER_ID)}>Гость отказался
                                            до заезда?
                                        </button>
                                    </td>);
                                }
                            }
                            let countLabel = order.MAN_COUNT + (parseInt(order.MAN_COUNT) == 1 ? ' взрослый' : ' взрослых');
                            if (parseInt(order.CHILD_COUNT)) {
                                countLabel += '+ ' + order.CHILD_COUNT + (parseInt(order.CHILD_COUNT) == 1 ? ' ребенок' : (parseInt(order.CHILD_COUNT) < 5 ? ' ребенка' : ' детей'));
                            }
                            let userName = order.USER_LAST_NAME ? order.USER_LAST_NAME : '';
                            userName += order.USER_NAME ? ' ' + order.USER_NAME : '';
                            userName += order.USER_SECOND_NAME ? ' ' + order.USER_SECOND_NAME : '';
                            html.push(
                                <tr key={basketItem.ID}>
                                    <td>{basketItem.ORDER_DATE_CREATE}</td>
                                    <td>
                                        {userName}
                                        <br/>
                                        <small>{countLabel}</small>
                                        <br/>
                                    </td>
                                    <td>{basketItem.ORDER_STATUS == 'N' || basketItem.ORDER_STATUS == 'C' || basketItem.ORDER_STATUS == 'OE' ? '*******' : order.USER_EMAIL}</td>
                                    <td>{basketItem.ORDER_STATUS == 'N' || basketItem.ORDER_STATUS == 'C' || basketItem.ORDER_STATUS == 'OE' ? '*******' : order.USER_PHONE}</td>
                                    <td>{basketItem.DATE_FROM}</td>
                                    <td>{basketItem.DATE_TO}</td>
                                    <td>{basketItem.NAME}</td>
                                    <td>{basketItem.ORDER_STATUS && statusList && statusList[basketItem.ORDER_STATUS]}</td>
                                    <td><i className="fa fa-rub fa-lg"></i> {basketItem.PRICE}</td>
                                    <td><i className="fa fa-rub fa-lg"></i> {order.COMMISSION ? order.COMMISSION : 0}
                                    </td>
                                    {action}
                                </tr>
                            );
                        }
                    }
                    break;
            }
        }
        let table = (<div></div>);
        if (mode == 'full') {
            switch (paymentType.VALUE_XML_ID) {
                case 'subscriber':
                    table = (
                        <div className="row booking-table-container">
                            <div className="card col-sm-12">
                                <div className="card-block col-sm-12">
                                    <div className="mb-1">
                                        <div>
                                            <div className="booking_feedWrap" ref='feedWrap_booking'
                                                 data-scrollbar={`feed_booking`}
                                                 onWheel={this.changeScrollBarView}
                                                 onMouseEnter={this.changeScrollBarView}
                                                 onMouseLeave={this.changeScrollBarView}>
                                                <div className="booking_feed">
                                                    <table
                                                        className="table table-hover grey lighten-4">
                                                        <thead>
                                                        <tr>
                                                            <th>Дата бронирования</th>
                                                            <th>Гость</th>
                                                            <th>Email</th>
                                                            <th>Телефон</th>
                                                            <th>Дата заезда</th>
                                                            <th>Дата выезда</th>
                                                            <th>Номер</th>
                                                            <th>Итоговая цена</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {html}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="booking_scrollBar" onScroll={this.handleScroll}
                                                     data-scroll='feedWrap_booking'>
                                                    <div className="booking_scrollBarInner"
                                                         ref="feed_booking"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                    break;
                default:
                    table = (
                        <div className="row booking-table-container">
                            <div className="card col-sm-12">
                                <div className="card-block col-sm-12">
                                    <div className="mb-1">
                                        <div>
                                            <div className="booking_feedWrap" ref='feedWrap_booking'
                                                 data-scrollbar={`feed_booking`}
                                                 onWheel={this.changeScrollBarView}
                                                 onMouseEnter={this.changeScrollBarView}
                                                 onMouseLeave={this.changeScrollBarView}>
                                                <div className="booking_feed">
                                                    <table
                                                        className="table table-hover grey lighten-4">
                                                        <thead>
                                                        <tr>
                                                            <th>Дата бронирования</th>
                                                            <th>Гость</th>
                                                            <th>Email</th>
                                                            <th>Телефон</th>
                                                            <th>Дата заезда</th>
                                                            <th>Дата выезда</th>
                                                            <th>Номер</th>
                                                            <th>Статус</th>
                                                            <th>Итоговая цена</th>
                                                            <th>Комиссия</th>
                                                            <th>Действия</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {html}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="booking_scrollBar" onScroll={this.handleScroll}
                                                     data-scroll='feedWrap_booking'>
                                                    <div className="booking_scrollBarInner"
                                                         ref="feed_booking"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                    break;
            }
        }
        else if (mode == 'light') {
            switch (paymentType.VALUE_XML_ID) {
                case 'subscriber':
                    table = (
                        <div className="row booking-table-container">
                            <div className="card-block col-sm-12">
                                <div className="mb-1">
                                    <table className="table table-hover grey lighten-4">
                                        <thead>
                                        <tr>
                                            <th>Дата бронирования</th>
                                            <th>Гость</th>
                                            <th>Email</th>
                                            <th>Телефон</th>
                                            <th>Дата заезда</th>
                                            <th>Дата выезда</th>
                                            <th>Номер</th>
                                            <th>Итоговая цена</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {html}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    );
                    break;
                default:
                    table = (
                        <div className="row booking-table-container">
                            <div className="card-block col-sm-12">
                                <div className="mb-1">
                                    <table className="table table-hover grey lighten-4">
                                        <thead>
                                        <tr>
                                            <th>Дата бронирования</th>
                                            <th>Гость</th>
                                            <th>Email</th>
                                            <th>Телефон</th>
                                            <th>Дата заезда</th>
                                            <th>Дата выезда</th>
                                            <th>Номер</th>
                                            <th>Статус</th>
                                            <th>Итоговая цена</th>
                                            <th>Комиссия</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {html}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    );
                    break;
            }
        }
        return table;
    }

    handleClick = e => {
        e.preventDefault();
        let isShow = this.state.showPanel;
        this.setState({showPanel: !isShow});
    }

    render() {
        const {orders, setFilter, handleSubmit, resetFilter, mode, activeObject, statusList} = this.props;
        const {showPanel} = this.state;
        let paymentType = {};
        if (activeObject && activeObject.object && activeObject.object.PROPS.PAYMENT_TYPE) {
            paymentType = activeObject.object.PROPS.PAYMENT_TYPE.VALUE_XML_ID;
        }
        let filterIcon = showPanel ? 'fa fa-caret-down ml-1' : 'fa fa-caret-up ml-1';
        let panelClass = showPanel ? 'tab-pane fade in show active' : 'tab-pane fade in show';
        let panel = '';
        if (mode == 'full') {
            if (showPanel) {
                if (paymentType != 'subscriber') {
                    let statusListHTML = [];
                    for (let statusCode in statusList) {
                        statusListHTML.push(
                            <div className="col-sm-6">
                                <Field component={renderCheckBox} type="checkbox" name={`FILTER[STATUS][${statusCode}]`}
                                       label={statusList[statusCode]}/>
                            </div>
                        );
                    }
                    panel = (
                        <div className="tab-content">
                            <div className={panelClass} id="panel1" role="tabpanel">
                                <div>
                                    <div className="row">
                                        <div className="col-lg-6 col-xs-12">
                                            <span className="col-sm-12">Статус бронирования</span>
                                            <div className="row d-inline-flex align-items-center">
                                                {statusListHTML}
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-xs-12">
                                            <div className="col-sm-12 mt-1">
                                                <Field component={renderField} type="text" name="FILTER[QUERY]"
                                                       label="Ключевые слова"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
                else {
                    panel = (
                        <div className="tab-content">
                            <div className={panelClass} id="panel1" role="tabpanel">
                                <div>
                                    <div className="row">
                                        <div className="col-lg-6 col-xs-12">
                                            <div className="col-sm-12 mt-1">
                                                <Field component={renderField} type="text" name="FILTER[QUERY]"
                                                       label="Ключевые слова"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
            }
            document.title = 'Бронирования - Edem-v-Gosti.ru';
        }
        let optionsForFilterType = {
            EMPTY: '',
            DATE_IN: 'Заезда',
            DATE_OUT: 'Выезда',
            DATE_CREATE: 'Бронирования'
        };
        let filter = ( <div></div>);
        if (mode == 'full') {
            filter = (
                <div className="container-fluid shadow grey lighten-3 pt-1 mb-1">
                    <form onSubmit={ handleSubmit(setFilter)}>
                        <div className="row">
                            <div className="col-sm-2">
                                <Field component={renderSelect} simpleValue={true} options={optionsForFilterType}
                                       name="FILTER[F_FIELD]" value="" label="Дата"/>
                            </div>
                            <div className="col-sm-2">
                                <Field component={renderField} type="date" className="mt-0" name="FILTER[DATE_FROM]"
                                       value=""
                                       label="С"/>
                            </div>
                            <div className="col-sm-2">
                                <Field component={renderField} type="date" className="mt-0" name="FILTER[DATE_TO]"
                                       value=""
                                       label="По"/>
                            </div>
                            <div className="col-sm-2">
                                <a name="OPEN_PANEL" data-toggle="tab" role="tab" href="#panel11"
                                   onClick={this.handleClick}
                                   className="btn btn-md btn-outline-info waves-effect cursor-pointer">Фильтр<i
                                    className={filterIcon}></i>
                                </a>
                            </div>
                            <div className="col-sm-2">
                                <button name="FILTER_ACTIVE" type="submit" className="btn btn-danger cursor-pointer">
                                    Показать
                                </button>
                            </div>
                            <div className="col-sm-2">
                                <button name="FILTER_ACTIVE" type="submit" onClick={resetFilter}
                                        className="btn blue cursor-pointer">Отмена
                                </button>
                            </div>
                        </div>
                        <ReactCSSTransitionGroup
                            transitionName="filter-panel"
                            transitionEnterTimeout={300}
                            transitionLeaveTimeout={300}
                            transitionAppear={true}
                            transitionAppearTimeout={300}>
                            {panel}
                        </ReactCSSTransitionGroup>
                    </form>
                </div>
            );
        }
        if (orders && orders.STATUS != 'NO_RESULT' && orders.STATUS != 'ERROR') {
            return (
                <div className="container-fluid">
                    {this.renderModal()}
                    {this.renderAlert()}
                    <div className="pageTitle">
                        <h3>Бронирования</h3>
                    </div>
                    <hr/>
                    {filter}
                    {this.renderTable()}
                </div>
            )
        } else {
            return (
                <div className="container-fluid booking-table-container">
                    {this.renderModal()}
                    <div className="pageTitle">
                        <h3>Бронирования</h3>
                    </div>
                    <hr/>
                    {filter}
                    <h3 className="text-center"> - Не найдено ни одной брони. - </h3>
                </div>
            );
        }
    }
}

export default reduxForm({
    form: 'ObjectBooking',
    enableReinitialize: true
})(ObjectBooking)