import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {date, Months, Now,ruShortDate, dateFromRuToDate} from '../../utils/date'
import Loader from '../../../utils/Loader'
import {DebounceInput} from 'react-debounce-input'
import InfiniteCalendar, {
    Calendar,
    withRange,
} from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';
import scrollTo from '../../utils/scrollTo'

var timerId;

const CalendarWithRange = withRange(Calendar);
const calendarLocale = {
    locale: require('date-fns/locale/ru'),
        headerFormat: 'dd, D MMM',
        weekdays: ["ПН","ВТ","СР","ЧТ","ПТ","СБ","ВС"],
        blank: 'Выберите дату',
        todayLabel: {
        long: 'Сегодня',
            short: 'Сег.'
    }
}

class Period extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datepicker:false,
            newPricePeriod:{}
        }
        this.scrollToHelp = this.scrollToHelp.bind(this)
        this.changeScrollBarView = this.changeScrollBarView.bind(this)
        this.handleScroll = this.handleScroll.bind(this)
        this.handleAllPricesChange = this.handleAllPricesChange.bind(this)
        this.scrollToHelp = this.scrollToHelp.bind(this)
    }
    componentWillMount(){
        if(window.location.hash == '#calendar-help'){
            this.scrollToHelp()
        }
    }
    handleAllPricesChange(e,event){
        e.preventDefault()
        const { prices } = this.props
        if(e.target.allPrice.value) {

            let newPrices = prices
            if (e.target.all_or_fill[0].checked) {
                for (let f of e.target) {
                    if (f.classList.contains('Calendar__p')) {
                        if (!f.value) {
                            newPrices[f.name] = e.target.allPrice.value
                        } else {
                            newPrices[f.name] = f.value
                        }

                    }
                }
            } else {
                for (let f of e.target) {
                    if (f.classList.contains('Calendar__p')) {
                        newPrices[f.name] = e.target.allPrice.value
                    }
                }
            }

            clearTimeout(timerId)
            timerId = setTimeout((e)=>this.props.onchange(newPrices),500)
        }
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
        const {periods} = this.props
        let result = []
        to = +(to)
        result.push(
            <div key={`${id}_header`} className="CalendarHeader">
                <div className="CalendarHeader__members"><i className="fa fa-user"></i></div>
                <div className="CalendarHeader__all">Заполнить всю строчку</div>
                <div className="CalendarHeader__period">Периоды</div>
            </div>
        )
        let rederPeriods = []
        rederPeriods.push(periods[id].map(period => (
            <div key={`${period}__period`} className="Calendar__item period__name">
                <div className="btn btn md blue w-100 ml-0 mr-0 period__dates" style={{padding:'5px'}} title="Кликните для изменения" onClick={(e) => this.setState((prev,props)=>{
                    return {datepicker:period}
                })}>{/*<i className="fa fa-calendar" aria-hidden="true"></i>*/} <span>{period.split('-')[0]} {period.split('-')[1]}</span></div>
                {this.renderDatepicker({period,id})}
            </div>
        )))
        rederPeriods.push(
            <div key={`new__period`}>
                <button type="button" className="btn btn-md btn-success btn-addPeriod" onClick={(e) => this.setState((prev,props)=>{
                    return {datepicker:'new',newPricePeriod:{id:id,from:from,to:to}}
                })}>Добавить период</button>
            </div>
        )
        result.push(
            <div key={`${id}__periods`} className="Calendar__periods Calendar__feed-block">
                {rederPeriods}
            </div>
        )
        for(let i=from; i <= to+2; i++){
            let guests = i
            if(i == (to+2)){
                if(!extraCount) continue

                guests = 'dop'
            }
            if(i == (to+1)){
                if(!childCount) continue

                guests = 'child'
            }

            result.push(
                <form key={`${id}${i}`} className="Calendar__feed-block" onSubmit={this.handleAllPricesChange}>
                    <div className="Calendar__members-count">
                        {this.renderGuestsIcon(guests)}
                    </div>
                    <div className="Calendar__item Calendar__item--all">
                        <div>
                            <div>
                                <input type="number"
                                       name="allPrice"
                                       className="Calendar__input Calendar__input--allprice"
                                />
                            </div>
                            <div className="Calendar__allSwitch shadow">
                                <input id={`all_or_fill_fill_${id}${guests}`} type="radio" className="all_or_fill" name="all_or_fill" value='fill' defaultChecked/><label htmlFor={`all_or_fill_fill_${id}${guests}`} className="mb-0">пустые</label>
                                <input className="all_or_fill" id={`all_or_fill_all_${id}${guests}`} type="radio" name="all_or_fill" value='all' /><label htmlFor={`all_or_fill_all_${id}${guests}`} className="mb-0">все</label>
                            </div>
                        </div>
                        <div className="text-center">
                            <button className="btn btn-sm btn-success mt-0 Calendar__btnOk">Ok</button>
                        </div>
                    </div>
                    {this.renderCalendarNet(id,guests)}
                    {/*<div>*/}
                        {/*<button type="button" className="btn btn-md btn-success" onClick={(e) => this.setState((prev,props)=>{*/}
                            {/*return {datepicker:'new',newPricePeriod:{id:id, guests:guests}}*/}
                        {/*})}>Добавить период</button>*/}
                    {/*</div>*/}
                </form>)
        }
        return result
    }
    renderGuestsIcon(g) {
        if(g == 'dop'){
            return (
                <div title="Дополнительное место">
                    <i className="fa fa-user-plus" aria-hidden="true"></i>
                </div>
            )
        } else if(g == 'child'){
            return (
                <div title="Место для ребёнка">
                    <i className="fa fa-child" aria-hidden="true"></i>
                </div>
            )
        }else {
            return (
                <div title={`${g} человек`}>
                    <i className="fa fa-user-times" aria-hidden="true"></i>{g}
                </div>
            )
        }
    }
    renderCalendarNet(id, g){
        //const months = Months()
        const { prices, periods } = this.props
        let result = []
        for(let period of periods[id]){
               result.push(
                   <div key={`${id}_${g}_${period}`} className="Calendar__item period">
                   <div>
                       <DebounceInput
                             type="number"
                             className="Calendar__input Calendar__p"
                             name={`${id}_${g}_${period}`}
                             min="0"
                             value={prices[`${id}_${g}_${period}`] || ''}
                             onChange={e => {
                                 let prices = this.props.prices
                                 let curPriceId = e.target.name
                                 let curPriceOpts = curPriceId.split('_')
                                 let newPrices = {}
                                 for(let p in prices){
                                     let pArr = p.split('_')
                                     if(pArr[0] == curPriceOpts[0]) {
                                         newPrices[p] = prices[p]
                                     }
                                 }
                                 newPrices[curPriceId] = e.target.value
                                 clearTimeout(timerId)
                                 timerId = setTimeout((e) => this.props.onchange(newPrices), 500)
                             }}
                         />
                   </div>
                 </div>
               )
        }
        return result
    }
    renderDatepicker({price,period, id}){
        if(period === this.state.datepicker) {
            if(period !== 'new'){
                period = period.split('-')
                var periodStr = period.join('-')
            }

            let start = period && period !== 'new' && dateFromRuToDate(period[0]) || null
            let end = period && period !== 'new' && dateFromRuToDate(period[1]) || null
            let curPrices = this.props.prices
            let curPeriods = this.props.periods[id]
            let minDate = Now
            let datePickerMinDate = Now
            let maxDate = new Date(2050, 11, 31)
            if (period === 'new') {
                let roomsId = this.state.newPricePeriod.id
                curPeriods = this.props.periods[roomsId]
                //let roomsGuests = this.state.newPricePeriod.guests
                if(curPeriods && curPeriods[curPeriods.length-1]){
                        let period = curPeriods[curPeriods.length-1].split('-')
                        minDate = dateFromRuToDate(period[1])
                        minDate.setDate(minDate.getDate()+1)
                        datePickerMinDate =start = end = minDate
                }
            }else {
                //let curPrice = price.split('_')
                //let roomsId = curPrice[0]
                //let roomsGuests = curPrice[1]
                for (let p of curPeriods) {
                    let pPeriod = p.split('-')
                    let pStart = dateFromRuToDate(pPeriod[0])
                    let pEnd = dateFromRuToDate(pPeriod[1])
                    if(start > pEnd){
                        minDate = pEnd
                        minDate.setDate(minDate.getDate()+1)
                    }
                    if(end < pStart){
                        maxDate = new Date(pStart-(24*60*60*1000))
                        //minDate.setDate(minDate.getDate()-1)
                        break
                    }
                }
            }

            return (
                <div className="Calendar__datepicker datePicker">
                    <div className="datePicker__overlay" onClick={(e) => this.setState((prev,props)=>{
                        return {datepicker:false}
                    })}/>
                    <div className="datePicker__content">
                        <div className="card">
                            <InfiniteCalendar
                                Component={CalendarWithRange}
                                locale={calendarLocale}
                                width={500}
                                height={300}
                                selected={{
                                    start: start,
                                    end: end
                                }}
                                //disabledDays={[0, 6]}
                                minDate={datePickerMinDate}
                                // maxDate={maxDate}
                                onSelect={(e) => {
                                    start = e.start
                                    end = e.end
                                }}
                            />
                            <button type="button" className="btn btn-warning" onClick={(e) => {
                                let newPrices = {}
                                if (period === 'new') {
                                    let roomsId = this.state.newPricePeriod.id
                                    let roomsGuestsFrom = this.state.newPricePeriod.from
                                    let roomsGuestsTo = this.state.newPricePeriod.to
                                    for(let p in this.props.prices){
                                        let pArr = p.split('_')
                                        if(pArr[0] === roomsId){
                                            newPrices[p] = this.props.prices[p]
                                        }
                                    }
                                    for(let i=roomsGuestsFrom; i <= roomsGuestsTo+2; i++){
                                        if(i == roomsGuestsTo+1) {
                                            newPrices[`${roomsId}_dop_${ruShortDate(start)}-${ruShortDate(end)}`] = ''
                                        }else if(i == roomsGuestsTo+2){
                                            newPrices[`${roomsId}_child_${ruShortDate(start)}-${ruShortDate(end)}`] = ''
                                        }else{
                                            newPrices[`${roomsId}_${i}_${ruShortDate(start)}-${ruShortDate(end)}`] = ''
                                        }
                                    }

                                    this.setState((prev,props)=>{
                                        return {datepicker:false}
                                    })

                                }else{
                                    //let curPriceOpts = price.split('_')
                                    if(period.join('-') == `${ruShortDate(start)}-${ruShortDate(end)}`){
                                        this.setState((prev,props)=>{
                                            return {datepicker:false}
                                        })
                                        return
                                    }
                                    let guestsVariations = []
                                    for(let p in curPrices){
                                        let pArr = p.split('_')
                                        if(pArr[0] == id){
                                            if(pArr[2] == periodStr){
                                                newPrices[`${pArr[0]}_${pArr[1]}_${ruShortDate(start)}-${ruShortDate(end)}`] = curPrices[p]
                                            }else {
                                                newPrices[p] = curPrices[p]
                                            }
                                            if(guestsVariations.indexOf(pArr[1]) === -1){
                                                guestsVariations.push(pArr[1])
                                            }
                                        }
                                    }

                                    if (start > minDate) {
                                        for(let guestsCount of guestsVariations) {
                                            newPrices[`${id}_${guestsCount}_${ruShortDate(minDate)}-${ruShortDate(new Date(start - (24 * 60 * 60 * 1000)))}`] = ''
                                        }
                                    }

                                    if (end < maxDate && maxDate.getTime() != (new Date(2050, 11, 31)).getTime()) {
                                        end.setDate(end.getDate() + 1)
                                        for(let guestsCount of guestsVariations) {
                                            newPrices[`${id}_${guestsCount}_${ruShortDate(end)}-${ruShortDate(maxDate)}`] = ''
                                        }
                                    }

                                    if (start < minDate) {
                                        for (let p in newPrices) {
                                            let pArr = p.split('_')
                                            let pPeriod = pArr[2].split('-')
                                            let pStart = dateFromRuToDate(pPeriod[0])
                                            let pEnd = dateFromRuToDate(pPeriod[1])
                                            if (start <= pStart && end > pEnd) {
                                                delete newPrices[p]
                                                continue
                                            }
                                            if (start <= pEnd && end > pEnd) {
                                                newPrices[`${pArr[0]}_${pArr[1]}_${pPeriod[0]}-${ruShortDate(new Date(start - (24 * 60 * 60 * 1000)))}`] = newPrices[p]
                                                delete newPrices[p]
                                            }
                                        }
                                    }
                                    if (end > maxDate) {
                                        const newEnd = end.setDate(end.getDate() + 1)
                                        for (let p in newPrices) {
                                            let pArr = p.split('_')
                                            let pPeriod = pArr[2].split('-')
                                            let pStart = dateFromRuToDate(pPeriod[0])
                                            let pEnd = dateFromRuToDate(pPeriod[1])
                                            if (end >= pEnd && start < pStart) {
                                                delete newPrices[p]
                                                continue
                                            }
                                            if (end >= pStart && start < pStart) {
                                                newPrices[`${pArr[0]}_${pArr[1]}_${ruShortDate(newEnd)}-${pPeriod[1]}`] = newPrices[p]
                                                delete newPrices[p]
                                            }
                                        }
                                    }

                                }
                                //console.log(newPrices)
                                this.props.onchange(newPrices)
                            }}>Выбрать</button>
                        </div>
                    </div>
                    <div className="card ml-1">
                        <div className="card-block">
                            Нажмите на начальную дату,<br/>
                            выберите период<br/>
                            и нажмите на конечную дату.<br/>
                            После этого нажмите на кнопку "ВЫБРАТЬ"
                            <br/>
                            <br/>
                            В календаре не может быть разрывов<br/>
                            Если вы изменяете даты уже созданного периода,<br/>
                            то в случае уменьшения продолжительности,<br/>
                            автоматически будет добавлен новый период.<br/>
                        </div>
                    </div>
                    <div className="datePicker__close"
                         onClick={(e) => this.setState({datepicker:false})}><i className="fa fa-close" aria-hidden="true"></i></div>
                </div>
            )
        }else{
            return <div/>
        }
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
        scrollBarWrapper.style.right = (window.innerWidth*0.02) + 'px'
        if(targetTop + 100 < windowHeight + windowScroll  && targetYposition - 20 > windowHeight + windowScroll){
            scrollBarWrapper.classList.add('show')
        }else{
            scrollBarWrapper.classList.remove('show')
        }

    }
    renderRooms(rooms){
        if (rooms && typeof(rooms) === 'object' && rooms[0]) {
            return rooms.map((room) => (
                <div key={room.ID} className="container-fluid Calendar__room">
                    <div className="row">
                        <div className="col col-sm-auto">
                            <h4>{room.NAME}</h4>
                        </div>
                        <div className="col-sm-3">
                            <div className="md-form inline-label">
                                <select className="form-control"
                                        defaultValue={room.PROPS.NADPIS_PRICE.VALUE_ENUM_ID}
                                        onChange={(e) => {
                                    this.props.onChangePriceType({id:room.ID, val:e.target.value})
                                }}>
                                    {this.renderPriceType(room.PROPS.NADPIS_PRICE.all,room.ID)}
                                </select>
                                <label className="control-label control-label--calendar active">Цена за:</label>
                            </div>
                        </div>
                        <div className="col-sm-auto">
                            <div className="card warning-color" style={{cursor:'pointer'}} onClick={this.scrollToHelp}>
                                <div className="container-fluid">
                                    Нажмите на это сообщение, чтобы подробнее узнать про заполнение календаря
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="Calendar__feedWrap" ref={`feedWrap_${room.ID}`} data-scrollbar={`feed_${room.ID}`} onWheel={this.changeScrollBarView}
                             onMouseEnter={this.changeScrollBarView}
                             onMouseLeave={this.changeScrollBarView}>
                            <div className="Calendar__feed period">
                                {this.renderCalendar(room.ID,room.PROPS.GOS_OT.VALUE,room.PROPS.GOS_DO.VALUE)}
                            </div>
                            <div className="Calendar__scrollBar" onScroll={this.handleScroll} data-scroll={`feedWrap_${room.ID}`}>
                                <div className="Calendar__scrollBarInner" ref={`feed_${room.ID}`}></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))
        } else {
            return <Loader loading={true}/>
        }
    }

    render() {
        const {rooms, onchange} = this.props
        return <div>{this.renderRooms(rooms)}{this.renderDatepicker({period:'new'})}</div>
    }
}

export default Period