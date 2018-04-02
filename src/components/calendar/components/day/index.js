import React, { Component, PureComponent } from 'react'
import { Link } from 'react-router-dom'
import {date, Months, Now,ruShortDate, dateFromRuToDate,DaysFromNow} from '../../utils/date'
import Loader from '../../../utils/Loader'
import {DebounceInput} from 'react-debounce-input'
import ReactTooltip from 'react-tooltip'
import scrollTo from '../../utils/scrollTo'
import renderDayCell from './renderDayCell'
import { SelectableGroup, createSelectable } from 'react-selectable'
import Modal from '../../../modal'
import InfiniteCalendar, {Calendar, withRange} from 'react-infinite-calendar'
import 'react-infinite-calendar/styles.css'
import FixedBottomBar from '../../../utils/FixedBottomBar'


var timerId;

const CalendarWithRange = withRange(Calendar);
const calendarLocale = {
    locale: require('date-fns/locale/ru'),
    headerFormat: 'dd, D MMM',
    weekdays: ["ПН","ВТ","СР","ЧТ","ПТ","СБ","ВС"],
    blank: 'Aucune date selectionnee',
    todayLabel: {
        long: 'Сегодня',
        short: 'Сег.'
    }
}
const weekdaysEnShort = ['sun','mon','tue','wed','thu','fri','sat']
const weekdaysRuShort = ['ВС','ПН','ВТ','СР','ЧТ','ПТ','СБ']

const DayCell = createSelectable(renderDayCell)

const isNodeInRoot = (node, root) => {
    while (node) {
        if (node === root) {
            return true;
        }
        node = node.parentNode;
    }

    return false;
};

class Day extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedItems: [],
            selectedFreeItems: [],
            tolerance: 0,
            selectOnMouseMove: false,
            showModal: false,
            editedPrices: null,
            editedFreeRooms: null,
            newprice: 0,
            newFreeRooms: 0,
            weekdaysShowing: ['sun','mon','tue','wed','thu','fri','sat']
        }

        this.handleSelection = this.handleSelection.bind(this)
        this.handleFreeSelection = this.handleFreeSelection.bind(this)
        this.clearItems = this.clearItems.bind(this)
        this.handleToleranceChange = this.handleToleranceChange.bind(this)
        this.toggleSelectOnMouseMove = this.toggleSelectOnMouseMove.bind(this)
        this.showModal = this.showModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.changePrices = this.changePrices.bind(this)
        this.changeFreeRooms = this.changeFreeRooms.bind(this)
        this.changeScrollBarView = this.changeScrollBarView.bind(this)
        this.handleScroll = this.handleScroll.bind(this)
        this.scrollToHelp = this.scrollToHelp.bind(this)
        this.handleWeekDaysFilterChange = this.handleWeekDaysFilterChange.bind(this)
        this.handkeWeekDaysFilterClick  = this.handkeWeekDaysFilterClick.bind(this)
    }
    componentDidMount () {
        document.addEventListener('click', this.clearItems);
    }


    componentWillUnmount () {
        document.removeEventListener('click', this.clearItems);
    }
    // shouldComponentUpdate(){
    //     return false
    // }

    handleSelection (keys) {
        this.showModal(keys)
        this.setState({
            selectedItems: keys
        });
    }

    handleFreeSelection (keys){
        this.showModal(keys, 'free')
        this.setState({
            selectedFreeItems: keys
        });
    }

    clearItems (e) {
        if(!isNodeInRoot(e.target, this.refs.selectable)) {
            this.setState({
                selectedItems: []
            });
        }
        if(!isNodeInRoot(e.target, this.refs.selectable_free)) {
            this.setState({
                selectedFreeItems: []
            });
        }
    }


    handleToleranceChange (e) {
        this.setState({
            tolerance: parseInt(e.target.value)
        });
    }

    toggleSelectOnMouseMove () {
        this.setState({
            selectOnMouseMove: !this.state.selectOnMouseMove
        });
    }
    renderCalendar(id, from, to) {
        const {rooms} = this.props
        let extraCount = 0
        let childCount = 0
        for(let room of rooms){
            if(room.ID == id){
	            extraCount = parseInt(room.PROPS.EXTRA_COUNT_TO.VALUE)
	            childCount = parseInt(room.PROPS.CHILD_COUNT_TO.VALUE)
            }
        }
        let result = []
        const days = DaysFromNow()
        const months = Months()
        let topDaysBar = []

        const {weekdaysShowing} =this.state
        for(let year in days){
            for(let month in days[year]){
                let m = []
                for(let day in days[year][month]){
                    const weekdayNumber = days[year][month][day].weekdayNumber
                    let isHidden = false
                    if(weekdaysShowing.indexOf(weekdaysEnShort[weekdayNumber]) === -1) {
                        isHidden = true
                        //    continue
                    }
                    m.push(
                        <div
                            className={`Calendar__item Calendar__item--dayName day ${ weekdayNumber === 0 || weekdayNumber === 6 ? 'red' : 'blue'} white-text ${isHidden ? 'hidden' : ''}`}
                            key={`${day}.${month}.${year}`}>
                            {day}
                            <sup className="small">{days[year][month][day].weekday}</sup>
                        </div>
                    )

                }
                topDaysBar.push(
                    <div className="d-flex flex-column daysTopBar__month cyan lighten-1" key={`${month}.${year}`}>
                        <div className="w-100"><div className="daysTopBar__monthName white-text">{`${months[+(month)-1][0]}, ${year}`}</div></div>
                        <div className="d-flex align-items-start">
                            {m}
                        </div>
                    </div>
                )

            }
            break
        }
        result.push(<div key="asd21313kasd" className="Calendar__feed-block Calendar__feed-block--daysTopBar daysTopBar">{topDaysBar}</div>)
        for(let i=from; i <= to; i++){
            result.push(
                <div key={`${id}${i}`} className="Calendar__feed-block">
                    <div className="Calendar__members-count" data-tip data-for={`${id}${i}_hint`}>
                        <i className="fa fa-user-times" aria-hidden="true"></i>{i}
                    </div>
                    <ReactTooltip place="right" id={`${id}${i}_hint`}>{i} человек</ReactTooltip>
                    {this.renderCalendarNet(id,i)}
                </div>)
        }
        if(childCount) {
            result.push(
                <div key={`${id}child`} className="Calendar__feed-block">
                    <div className="Calendar__members-count" title="Место для ребёнка" data-tip
                         data-for={`${id}child_hint`}>
                        <i className="fa fa-child" aria-hidden="true"></i>
                    </div>
                    <ReactTooltip place="right" id={`${id}child_hint`}>Место для ребёнка</ReactTooltip>
                    {this.renderCalendarNet(id, 'child')}
                </div>)
        }
        if(extraCount) {
            result.push(
                <div key={`${id}dop`} className="Calendar__feed-block">
                    <div className="Calendar__members-count" title="Дополнительное место" data-tip
                         data-for={`${id}dop_hint`}>
                        <i className="fa fa-user-plus" aria-hidden="true"></i>
                    </div>
                    <ReactTooltip place="right" id={`${id}dop_hint`}>Дополнительное место</ReactTooltip>
                    {this.renderCalendarNet(id, 'dop')}
                </div>)
        }
        return result
    }
    renderCalendarNet(id, g){
        const days = DaysFromNow()
        const months = Months()
        const { prices, freeRoomsCount } = this.props
        const { weekdaysShowing } = this.state
        //console.log(freeRoomsCount)

        let result = []
        for(let year in days){
            for(let month in days[year]){
                let m = []
                for(let day in days[year][month]){
                    const weekdayNumber = days[year][month][day].weekdayNumber
                    let isHidden = false
                    if(weekdaysShowing.indexOf(weekdaysEnShort[weekdayNumber]) === -1) {
                        isHidden = true
                    //    continue
                    }
                    let formatMonth  = month < 10 ? '0' + month : month
                    let formatDay  = day < 10 ? '0' + day : day
                    const dayId = `${id}_${g}_${formatDay}.${formatMonth}.${year}-${formatDay}.${formatMonth}.${year}`
                    const selected = this.state.selectedItems.indexOf(dayId) > -1 || this.state.selectedFreeItems.indexOf(dayId) > -1;
                    m.push(<div key={`${id}_${g}_${formatDay}.${formatMonth}.${year}`} className={`Calendar__item day${isHidden ? ' hidden' : ''}`}>
                            <DayCell
                                selectableKey={dayId}
                                price={g=='free'? freeRoomsCount[dayId] :prices[dayId]}
                                id = {dayId}
                                selected={selected}
                                onClick={(e) => this.showModal([dayId],g)}
                            />
                        </div>
                    )

                }
                result.push(<div className={`Calendar__monthFeed`} key={month+year}>{m}</div>)
            }
            break
        }
        return result
    }
    renderWeekDaysFilter(uniq){
      const {weekdaysShowing} = this.state
			return(
			   <div className='weekdaysFilter' ref="weekdaysFilter">
			       {/*<h6>Фильтр по дням</h6>*/}
			       <div>
			           {weekdaysEnShort.map((day, index) => {
			           	  if(index === 0) return
			               return (
			                   <span className={`weekdaysFilter__button weekdaysFilter__button--${day}`} key={`weekday_${day}`}>
			                       <input className="weekdaysFilter__checkbox" type="checkbox" id={day+uniq} name={day} checked={weekdaysShowing.indexOf(day) !== -1} onChange={this.handleWeekDaysFilterChange} onClick={this.handkeWeekDaysFilterClick}/>
			                       <label className={`weekdaysFilter__label weekdaysFilter__label--${day}`} htmlFor={day+uniq}>{weekdaysRuShort[index]}</label>
			                   </span>)
			           })}
                 <span className={`weekdaysFilter__button weekdaysFilter__button--sun`} key={`weekday_sun`}>
                     <input className="weekdaysFilter__checkbox" type="checkbox" id={`sun${uniq}`} name="sun" defaultChecked={weekdaysShowing.indexOf('sun') !== -1} onChange={this.handleWeekDaysFilterChange} onClick={this.handkeWeekDaysFilterClick}/>
                     <label className={`weekdaysFilter__label weekdaysFilter__label--sun`} htmlFor={`sun${uniq}`}>{weekdaysRuShort[0]}</label>
                 </span>
			       </div>
			   </div>
			)
    }
    handkeWeekDaysFilterClick(){
        const filter = this.refs.weekdaysFilter
        filter.classList.add('loading')
        setTimeout(()=>filter.classList.remove('loading') , 1000)
    }
    handleWeekDaysFilterChange(e){
        const {weekdaysShowing} = this.state
        const filter = this.refs.weekdaysFilter
        const target = e.target
        const wDay =  target.name
        let  newWeekDays = weekdaysShowing
        if(target.checked){
            newWeekDays.push(wDay)
        } else {
            weekdaysShowing.splice(weekdaysShowing.indexOf(wDay), 1)
        }
        this.setState({
            weekdaysShowing: newWeekDays
        })
    }
    showModal(keys,type){

        if(type === 'free'){
            this.setState({
                showModal: true,
                editedFreeRooms: keys
            })
        }else {
            this.setState({
                showModal: true,
                editedPrices: keys
            })
            if (keys.length === 1 && this.props.prices[keys[0]]) {
                this.setState({newprice: this.props.prices[keys[0]]})
            } else {
                this.setState({newprice: 0})
            }
        }
    }
    renderModal(){
        const newprice = this.state.newprice
        const show = this.state.showModal || false
        const editedPrices = this.state.editedPrices
        const { prices,rooms} = this.props

        const editedFreeRooms = this.state.editedFreeRooms
        if(editedFreeRooms) {
            const editedRoom = editedFreeRooms[0].split('_')
            let max = 10
            for (let r of rooms) {
                if (r['ID'] === editedRoom[0]) {
                    max = r.PROPS.VSEGO.VALUE
                }
            }

                return <Modal
                    show={show}
                    btnOkText="Изменить"
                    btnCloseText='Отмена'
                    onOk={this.changeFreeRooms}
                    onClose={this.closeModal}
                >
                    <div className="mb-1">
                        <small>Количество свободных номеров</small>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <DebounceInput type="number" min={0} max={max} ref="newFreeRooms"
                                           placeholder="Количество номеров"
                                           onChange={(e) => {
                                                this.setState({newFreeRooms: e.target.value})
                                            }}/>
                        </div>
                    </div>
                </Modal>
            } else if (editedPrices && newprice) {
                return <Modal
                    show={show}
                    btnOkText="Изменить"
                    btnCloseText='Отмена'
                    onOk={this.changePrices}
                    onClose={this.closeModal}
                >
                    <div className="mb-1">
                        <small>Введите цену для выбранной даты</small>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <input type="number" ref="newprice" placeholder="Введите новую цену" value={newprice}
                                   onChange={(e) => {
                                       this.setState({newprice: e.target.value})
                                   }}/>
                        </div>
                    </div>
                </Modal>
            } else if (editedPrices) {
                return <Modal
                    show={show}
                    btnOkText="Изменить"
                    btnCloseText='Отмена'
                    onOk={this.changePrices}
                    onClose={this.closeModal}
                >
                    <div className="mb-1">
                        <small>Введите цену для выбранных дат</small>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <input type="number" ref="newprice" placeholder="Введите новую цену"/>
                        </div>
                    </div>
                </Modal>
            }

    }
    changeFreeRooms(e){
        //console.log(this)
        const newFreeRoomsCount = parseInt(this.refs.newFreeRooms.state.value)
        const editedFreeRooms = this.state.editedFreeRooms
        let {freeRoomsCount} = this.props
       // console.log(freeRoomsCount)
        //freeRoomsCount = freeRoomsCount || {}
        for(let fr of editedFreeRooms) {
            freeRoomsCount[fr] = newFreeRoomsCount
        }
        this.props.onchange(freeRoomsCount)
        this.closeModal()
    }
    changePrices(e){
        const newPrice = this.refs.newprice.value
        //const newFreeRooms = this.refs.newFreeRooms.value
        const editedPrices = this.state.editedPrices
        if(parseInt(newPrice) > 0) {
            let {prices} = this.props
            for(let p of editedPrices){
                prices[p] = newPrice
                //---------
                // const priceInfo = p.split('_')
                // const pricePeriod = priceInfo[1].split('-')
                //
                // if(!pricesList[priceInfo[0]]){pricesList[priceInfo[0]] = {}}
                // if(!pricesList[priceInfo[0]][priceInfo[1]]){
                //     // pricesList[priceInfo[0]][priceInfo[1]] = [{
                //     //     data_ot: pricePeriod[0],
                //     //     data_do: pricePeriod[1],
                //     //     value: newPrice
                //     // }]
                // }else {
                //     // for(let priceKey in pricesList[priceInfo[0]][priceInfo[1]]){
                //     //     let price = pricesList[priceInfo[0]][priceInfo[1]][priceKey]
                //     //     if(price['data_ot'] == pricePeriod[0] && price['data_do'] == pricePeriod[1]){
                //     //        price['value'] = newPrice
                //     //        break
                //     //        continue
                //     //     }
                //     // }
                //
                // }

            }
           this.props.onchange(prices)
        }
        this.closeModal()
    }
    closeModal() {
        this.setState({
            showModal: false,
            editedPrices: null,
            editedFreeRooms: null,
            newprice:0,
            newFreeRooms:0

        })
    }
    renderPriceType(types, id){
        if(types){
            let result = []
            for(let type in types){
                result.push(<option key={`${id}${type}`}  value={type}>{types[type]}</option>)
            }
            return result
        }else{
            return <option>-</option>
        }
    }
    checkSelector(selector){
        return !!document.querySelector(selector)
    }
    scrollToHelp(e){
        const selector = this.checkSelector('#calendar-help-percent') ? '#calendar-help-percent' :'#calendar-help-subscriber'
        if(window.location.hash !== selector){
            window.history.pushState(null, null, selector)
        }
        scrollTo({selector:selector})
    }
    renderRooms(rooms) {
        if (rooms && rooms.length > 0) {
            return rooms.map((room) => (
                <div key={room.ID} className="container-fluid Calendar__room">
                    <div className="row">
                        <div className="col col-sm-auto">
                            <h5>{room.NAME}</h5>
                        </div>
                        {/*<div className="col-sm-2">*/}
                            {/*<div className="md-form inline-label">*/}
                                {/*<select className="form-control"*/}
                                        {/*defaultValue={room.PROPS.NADPIS_PRICE.VALUE_ENUM_ID}*/}
                                        {/*onChange={(e) => {*/}
                                            {/*this.props.onChangePriceType({id: room.ID, val: e.target.value})*/}
                                        {/*}}>*/}
                                    {/*{this.renderPriceType(room.PROPS.NADPIS_PRICE.all, room.ID)}*/}
                                {/*</select>*/}
                                {/*<label className="control-label control-label--calendar active">Цена за:</label>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                        <div className="col-sm-auto">
                            <div className="card warning-color" style={{cursor: 'pointer'}} onClick={this.scrollToHelp}>
                                <div className="container-fluid">
                                    Нажмите на это сообщение, чтобы подробнее узнать про заполнение календаря
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-auto ml-1">
	                        {this.renderWeekDaysFilter(room.ID)}
                        </div>
                    </div>
                    <div>
                        <div className="Calendar__feedWrap"
                             onWheel={this.changeScrollBarView}
                             onMouseEnter={this.changeScrollBarView}
                             onMouseLeave={this.changeScrollBarView}
                             ref={`feedWrap_${room.ID}`}
                             data-scrollbar={`feed_${room.ID}`}>
                            {/*<Scrollbars autoHeight  autoHeightMax={10000} renderTrackHorizontal={this.renderTrackHorizontal}>*/}
                            <div className="Calendar__feed day">
                                <SelectableGroup ref="selectable"
                                                 onSelection={this.handleSelection}
                                                 tolerance={this.state.tolerance}
                                                 selectOnMouseMove={this.state.selectOnMouseMove}>
                                    {this.renderCalendar(room.ID, room.PROPS.GOS_OT.VALUE, room.PROPS.GOS_DO.VALUE)}
                                </SelectableGroup>
                                <small>количество свободных номеров</small>
                                <SelectableGroup ref="selectable__free"
                                                 onSelection={this.handleFreeSelection}
                                                 tolerance={this.state.tolerance}
                                                 selectOnMouseMove={this.state.selectOnMouseMove}>
                                    <div className="Calendar__feed-block mb-1   ">
                                        {this.renderCalendarNet(room.ID, 'free')}
                                    </div>
                                </SelectableGroup>
                            </div>
                            {/*</Scrollbars>*/}
                        </div>
                        <div className="Calendar__scrollBar" onScroll={this.handleScroll} data-scroll={`feedWrap_${room.ID}`}>
                            <div className="Calendar__scrollBarInner" ref={`feed_${room.ID}`}></div>
                        </div>
                    </div>
                </div>
            ))
        } else {
            return <Loader loading={true}/>
        }
    }
    handleScroll(e,evt){
        const target = e.currentTarget
        const offset = target.scrollLeft
        const feedId = target.getAttribute('data-scroll')
        const feed = this.refs[feedId]
        feed.scrollLeft = offset
    }
    changeScrollBarView (e, evt) {
        const eventType = e.type
        const target = e.currentTarget
        const feedWidth = target.querySelector('.Calendar__feed').clientWidth
        const scrollBarId = target.getAttribute('data-scrollbar')
        const scrollBar = this.refs[scrollBarId]
        const scrollBarWrapper = scrollBar.parentNode
        scrollBar.style.width = feedWidth + 'px'
        if(eventType === 'mouseleave'){
            scrollBarWrapper.classList.remove('show')
            return
        }
        scrollBarWrapper.classList.add('show')
        const windowScroll = window.scrollY
        const windowHeight = window.innerHeight
        const targetOffset = target.getBoundingClientRect()
        const targetTop = targetOffset.top + windowScroll
        const targetYposition = +(targetTop) +(target.clientHeight)
        scrollBarWrapper.style.left = targetOffset.left + 'px'
        scrollBarWrapper.style.right = window.innerWidth - targetOffset.left - target.clientWidth - (window.innerWidth*0.025) + 'px'
        if(targetTop + 100 < windowHeight + windowScroll  && targetYposition - 20 > windowHeight + windowScroll){
            scrollBarWrapper.classList.add('show')
        }else{
            scrollBarWrapper.classList.remove('show')
        }
    }
    render() {
        const {rooms, onchange, freeRoomsCount} = this.props
        if(rooms && rooms.length > 0) {
            return (
                <div>
                    {this.renderRooms(rooms)}
                    {this.renderModal()}
                    {/*<FixedBottomBar opacity={1} shadow={true}>*/}
                    {/*</FixedBottomBar>*/}
                </div>
            )
        }else{
            return <Loader loading={true}/>
        }
    }
}

export default Day