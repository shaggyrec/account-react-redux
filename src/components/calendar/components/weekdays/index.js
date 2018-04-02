import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {date, Months, MonthsFromNow} from '../../utils/date'
import Loader from '../../../utils/Loader'
import {DebounceInput} from 'react-debounce-input';
import scrollTo from '../../utils/scrollTo'

var timerId;
const months = MonthsFromNow()

class Weekdays extends Component {
    constructor(props) {
        super(props);
        //this.state = {rooms:};
        this.changePrice = this.changePrice.bind(this)
        this.scrollToHelp = this.scrollToHelp.bind(this)
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     //return false
    // }
    renderCalendar(id, from, to, room) {
        let result = []
        const extraCount = parseInt(room.PROPS.EXTRA_COUNT_TO.VALUE)
        const childCount = parseInt(room.PROPS.CHILD_COUNT_TO.VALUE)
        
        
        result.push(
            <div key={`${id}__periods`} className="Calendar__periods Calendar__periods--weekdays  Calendar__feed-block">
                <div/>
                <div key={`${id}_w`} className="Calendar__item period__name">
                    <div className="month__name">Будни</div>
                </div>
                <div key={`${id}_d`} className="Calendar__item period__name">
                    <div className="month__name">Выходные</div>
                </div>
                <div key={`${id}_h`} className="Calendar__item period__name">
                    <div className="month__name">Праздники</div>
                </div>
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
			        {this.renderCalendarNet(id, 'dop')}
            </form>)
        }
        return result
    }
    renderCalendarNet(id, g){
        const { prices } = this.props
        let result = []

        result.push(
            <div key={`${id}_${g}_weekdays`} className="Calendar__item month">
                <DebounceInput
                    type="number"
                    className="Calendar__input Calendar__p"
                    name={`${id}_${g}_weekdays`}
                    min="0"
                    value={prices[`${id}_${g}_weekdays`]}
                    onChange={this.changePrice}
                />
            </div>
        )
        result.push(
            <div key={`${id}_${g}_weekend`} className="Calendar__item month">
                <DebounceInput
                    type="number"
                    className="Calendar__input Calendar__p"
                    name={`${id}_${g}_weekend`}
                    min="0"
                    value={prices[`${id}_${g}_weekend`]}
                    onChange={this.changePrice}
                />
            </div>
        )
        result.push(
            <div key={`${id}_${g}_holidays`} className="Calendar__item month">
                <DebounceInput
                    type="number"
                    className="Calendar__input Calendar__p"
                    name={`${id}_${g}_holidays`}
                    min="0"
                    value={prices[`${id}_${g}_holidays`]}
                    onChange={this.changePrice}
                />
            </div>
        )

        return result
    }
    changePrice (e) {
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

    renderRooms(rooms){
        if (rooms && rooms.length > 0) {
            return rooms.map((room) => (
                <div key={room.ID} className="container-fluid Calendar__room">
                    <div className="row">
                        <div className="col-2">
                            {room.NAME}
                            <div className="md-form">
                                <select className="form-control" onChange={(e) => {
                                    this.props.onChangePriceType({id:room.ID, val:e.target.value})
                                }}>
                                    {this.renderPriceType(room.PROPS.NADPIS_PRICE.all, room.PROPS.NADPIS_PRICE.VALUE_ENUM_ID, room.ID)}
                                </select>
                                <label className="control-label control-label--calendar active">Цена за:</label>
                            </div>
                            <div className="card warning-color" style={{cursor:'pointer'}} onClick={this.scrollToHelp}>
                                <div className="container-fluid">
                                    Нажмите на это сообщение, чтобы подробнее узнать про заполнение календаря
                                </div>
                            </div>
                        </div>
                        <div className="col-10">
                            <div className="Calendar__feedWrap">
                                <div className="Calendar__feed months">
                                    {this.renderCalendar(room.ID,room.PROPS.GOS_OT.VALUE,room.PROPS.GOS_DO.VALUE,room)}
                                </div>
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

export default Weekdays