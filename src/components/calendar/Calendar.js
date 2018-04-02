import React, { Component } from 'react'
//import { Link } from 'react-router-dom'
import './Calendar.css'
import Period from './components/period'
import Months from './components/month'
import Day from './components/day'
import Weekdays from './components/weekdays'
//import BigCalendar from 'react-big-calendar'
//import 'react-big-calendar/lib/css/react-big-calendar.css'
//import moment from 'moment'

//BigCalendar.momentLocalizer(moment)

class Calendar extends Component {
    render(){
        const {type, rooms, onchange,onChangePriceType, prices, freeRoomsCount, periods} = this.props
        if(type === 'Months') {
            return (
                <div className="Calendar">
                    <Months rooms={rooms} onchange={onchange} onChangePriceType={onChangePriceType} prices={prices}/>
                </div>
            )
        }else if(type === 'Days') {
            return (
                <div className="Calendar">
                    <Day rooms={rooms} onchange={onchange} onChangePriceType={onChangePriceType} prices={prices} freeRoomsCount={freeRoomsCount} />
                </div>
            )
        }else if(type === 'Period') {
            return (
                <div className="Calendar">
                    <Period rooms={rooms} onchange={onchange} onChangePriceType={onChangePriceType} prices={prices} periods={periods}/>
                </div>
            )
        }else if(type === 'Weekdays') {
            return (
                <div className="Calendar">
                    <Weekdays rooms={rooms} onchange={onchange} onChangePriceType={onChangePriceType} prices={prices}/>
                </div>
            )
        } else {
            return <div />
        }
    }
}

export default Calendar