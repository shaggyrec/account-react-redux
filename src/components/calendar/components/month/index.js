import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {date, Months, MonthsFromNow} from '../../utils/date'
import Loader from '../../../utils/Loader'
import {DebounceInput} from 'react-debounce-input';
import scrollTo from '../../utils/scrollTo'

var timerId;
const months = MonthsFromNow()

class Month extends Component {
    constructor(props) {
        super(props);
        this.changeScrollBarView = this.changeScrollBarView.bind(this)
        this.handleScroll = this.handleScroll.bind(this)
        this.scrollToHelp = this.scrollToHelp.bind(this)
        this.scrollToHelp = this.scrollToHelp.bind(this)
    }
    componentWillMount(){
        if(window.location.hash == '#calendar-help'){
            this.scrollToHelp()
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
        let result = []
        result.push(
            <div key={`${id}_header`} className="CalendarHeader">
                <div className="CalendarHeader__members"><i className="fa fa-user"></i></div>
                <div className="CalendarHeader__all">Заполнить всю строчку</div>
                <div className="CalendarHeader__period">Месяцы</div>
            </div>
        )
        let monthsNames = []
        for(let y in months) {
            let year = []
            for(let month1 in months[y]) {
                const month = months[y][month1]
                year.push(
                    <div key={`${id}_monthname_${month[3]}`} className="Calendar__item period__name">
                        <div className="month__name">{month[0]}</div>
                    </div>
                )
            }
            monthsNames.push(
                    <div key={y+'Calendar__year'} className="Calendar__year d-flex flex-column">
                        <div className="Calendar__yearName">{y}</div>
                        <div className="Calendar__yearMonths d-flex">{year}</div>
                    </div>
            )
        }
        result.push(
            <div key={`${id}__periods`} className="Calendar__periods Calendar__feed-block">
                {monthsNames}
            </div>
        )
        for(let i=from; i <= to; i++){
            result.push(
                <form key={`${id}${i}`} className="Calendar__feed-block" onSubmit={(e,event)=>{
                    e.preventDefault()

                    if(e.target.allPrice.value) {
                        let periods = []
                        if (e.target.all_or_fill[0].checked) {
                            for(let f of e.target){
                                if(f.classList.contains('Calendar__p') && !f.value){
                                    let optsArr = f.name.split('_')
                                    periods.push(optsArr[2])
                                }
                            }
                        } else {
                            for(let f of e.target){
                                if(f.classList.contains('Calendar__p')){
                                    let optsArr = f.name.split('_')
                                    periods.push(optsArr[2])
                                }
                            }
                        }
                        let opts = {
                            id: id,
                            guests: i,
                            periods:periods,
                            value: e.target.allPrice.value
                        }
                        clearTimeout(timerId)
                        timerId = setTimeout((e)=>this.props.onchange(opts),500)
                    }
                }}>
                    <div className="Calendar__members-count">
                        <i className="fa fa-user-times" aria-hidden="true"/>{i}
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
                                <input id={`all_or_fill_fill_${id}${i}`} type="radio" className="all_or_fill" name="all_or_fill" value='fill' defaultChecked/><label htmlFor={`all_or_fill_fill_${id}${i}`} className="mb-0">пустые</label>
                                <input className="all_or_fill" id={`all_or_fill_all_${id}${i}`} type="radio" name="all_or_fill" value='all' /><label htmlFor={`all_or_fill_all_${id}${i}`} className="mb-0">все</label>
                            </div>
                        </div>
                        <div className="text-center">
                            <button className="btn btn-sm btn-success mt-0 Calendar__btnOk">Ok</button>
                        </div>
                    </div>
                    {this.renderCalendarNet(id,i)}
                </form>)
        }
        if(childCount) {
            result.push(
                <form key={`${id}child`} className="Calendar__feed-block" onSubmit={(e, event) => {
                    e.preventDefault()

                    if (e.target.allPrice.value) {
                        let periods = []
                        if (e.target.all_or_fill[0].checked) {
                            for (let f of e.target) {
                                if (f.classList.contains('Calendar__p') && !f.value) {
                                    let optsArr = f.name.split('_')
                                    periods.push(optsArr[2])
                                }
                            }
                        } else {
                            for (let f of e.target) {
                                if (f.classList.contains('Calendar__p')) {
                                    let optsArr = f.name.split('_')
                                    periods.push(optsArr[2])
                                }
                            }
                        }
                        let opts = {
                            id: id,
                            guests: 'child',
                            periods: periods,
                            value: e.target.allPrice.value
                        }
                        clearTimeout(timerId)
                        timerId = setTimeout((e) => this.props.onchange(opts), 500)
                    }
                }}>
                    <div className="Calendar__members-count" title="Место для ребёнка">
                        <i className="fa fa-child" aria-hidden="true"></i>
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
                                <input id={`all_or_fill_fill_${id}child`} type="radio" className="all_or_fill"
                                       name="all_or_fill" value='fill' defaultChecked/><label
                                htmlFor={`all_or_fill_fill_${id}child`} className="mb-0">пустые</label>
                                <input className="all_or_fill" id={`all_or_fill_all_${id}child`} type="radio"
                                       name="all_or_fill" value='all'/><label htmlFor={`all_or_fill_all_${id}child`}
                                                                              className="mb-0">все</label>
                            </div>
                        </div>
                        <div className="text-center">
                            <button className="btn btn-sm btn-success mt-0 Calendar__btnOk">Ok</button>
                        </div>
                    </div>
                    {this.renderCalendarNet(id, 'child')}
                </form>)
        }
        if(extraCount) {
            result.push(
                <form key={`${id}dop`} className="Calendar__feed-block" onSubmit={(e, event) => {
                    e.preventDefault()

                    if (e.target.allPrice.value) {
                        let periods = []
                        if (e.target.all_or_fill[0].checked) {
                            for (let f of e.target) {
                                if (f.classList.contains('Calendar__p') && !f.value) {
                                    let optsArr = f.name.split('_')
                                    periods.push(optsArr[2])
                                }
                            }
                        } else {
                            for (let f of e.target) {
                                if (f.classList.contains('Calendar__p')) {
                                    let optsArr = f.name.split('_')
                                    periods.push(optsArr[2])
                                }
                            }
                        }
                        let opts = {
                            id: id,
                            guests: 'dop',
                            periods: periods,
                            value: e.target.allPrice.value
                        }
                        clearTimeout(timerId)
                        timerId = setTimeout((e) => this.props.onchange(opts), 500)
                    }
                }}>
                    <div className="Calendar__members-count" title="Дополнительное место">
                        <i className="fa fa-user-plus" aria-hidden="true"></i>
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
                                <input id={`all_or_fill_fill_${id}dop`} type="radio" className="all_or_fill"
                                       name="all_or_fill" value='fill' defaultChecked/><label
                                htmlFor={`all_or_fill_fill_${id}dop`} className="mb-0">пустые</label>
                                <input className="all_or_fill" id={`all_or_fill_all_${id}dop`} type="radio"
                                       name="all_or_fill" value='all'/><label htmlFor={`all_or_fill_all_${id}dop`}
                                                                              className="mb-0">все</label>
                            </div>
                        </div>
                        <div className="text-center">
                            <button className="btn btn-sm btn-success mt-0 Calendar__btnOk">Ok</button>
                        </div>
                    </div>
                    {this.renderCalendarNet(id, 'dop')}
                </form>)
        }
        return result
    }
    renderCalendarNet(id, g){
        const { prices } = this.props
        let result = []
        for(let y in months) {
            for(let month1 in months[y]) {
                const month = months[y][month1]

                result.push(<div key={`${id}_${g}_${month[3]}`} className="Calendar__item month">
                    {/*<div className="month__name">{month[0]}, {y}</div>*/}
                    <DebounceInput
                        type="number"
                        className="Calendar__input Calendar__p"
                        name={`${id}_${g}_${month[3]}`}
                        min="0"
                        value={prices[`${id}_${g}_${month[3]}`]}
                        onChange={e => {
                            let optsArr = e.target.name.split('_')
                            let opts = {
                                id: optsArr[0],
                                guests: optsArr[1],
                                period: optsArr[2],
                                value: e.target.value
                            }
                            clearTimeout(timerId)
                            timerId = setTimeout((e) => this.props.onchange(opts), 500)
                        }}
                    />
                </div>)
            }
        }
        return result
    }
    renderPriceType(types, curType, id){
        if(types){
            let result = []
            for(let type in types){
                if(type == curType) {
                    result.push(<option key={`${id}${type}`} value={type} selected={true}>{types[type]}</option>)
                }else{
                    result.push(<option key={`${id}${type}`}  value={type}>{types[type]}</option>)
                }
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
        scrollBarWrapper.style.right = window.innerWidth - targetOffset.left - target.clientWidth - (window.innerWidth*0.025) + 'px'
        if(targetTop + 100 < windowHeight + windowScroll  && targetYposition - 20 > windowHeight + windowScroll){
            scrollBarWrapper.classList.add('show')
        }else{
            scrollBarWrapper.classList.remove('show')
        }

    }
    renderRooms(rooms){
        if (rooms && rooms.length > 0) {
            return rooms.map((room) => (
                <div key={room.ID} className="container-fluid Calendar__room">
                    <div className="row">
                        <div className="col col-sm-auto">
                            {room.NAME}
                        </div>
                        <div className="col-sm-2">
                            <div className="md-form inline-label">
                                <select className="form-control" onChange={(e) => {
                                    this.props.onChangePriceType({id:room.ID, val:e.target.value})
                                }}>
                                    {this.renderPriceType(room.PROPS.NADPIS_PRICE.all, room.PROPS.NADPIS_PRICE.VALUE_ENUM_ID, room.ID)}
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
                        <div className="Calendar__feedWrap" ref={`feedWrap_${room.ID}`} data-scrollbar={`feed_${room.ID}`}
                             onWheel={this.changeScrollBarView}
                             onMouseEnter={this.changeScrollBarView}
                             onMouseLeave={this.changeScrollBarView}>
                            <div className="Calendar__feed months">
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
        return <div>{this.renderRooms(rooms)}</div>
    }
}

export default Month