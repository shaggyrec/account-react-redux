import React, { Component } from 'react'
import Calendar from '../calendar/Calendar'
import { Months, DaysFromNow, DaysFromTo } from '../calendar/utils/date'
import { Link } from 'react-router-dom'
import PageText from '../pageText'
import ErrorBar from '../utils/ErrorBar'



class RoomsCalendar extends Component {

    constructor(props) {
        super(props)
        this.onchange.bind(this)
        this.calendarTypeChange = this.calendarTypeChange.bind(this)
        this.state = {
            updating: false
        }
    }

    componentWillMount() {
        let token = localStorage.getItem('jwtToken');
        //if (!token || token === '') {return;}
        const { object } = this.props.activeObject;
        if( !object || +(object.ID) !== +(this.props.objectId)) {
            this.props.fetchObject(this.props.objectId, token);
        }else if(object.PROPS.NOMERA){
            this.props.fetchRooms(object.PROPS.NOMERA.VALUE,token)
        }
        if(!this.props.roomTypes.types) {
            this.props.fetchRoomTypes()
        }
    }

    onchange(opts){
        this.props.updateRoomsCalendar(opts)
    }
    onChangePriceType (opts){
        this.props.updateRoom(opts.id,{'NADPIS_PRICE':opts.val})
    }


    calendarTypeChange(e,type){
        const { updateRoomsCalendarByPeriod } = this.props
        if(window.confirm('Внимание! Изменение типа календаря приведёт к конвертации цен к новому виду. Отменить это действие будет невозможно. Изменить тип календаря на "'+ e.target.value + '"?')) {
            this.props.changeCalendarType(e.target.value, (newType)=>{
                const {prices} = this.props
                if(!prices){return}
                let newPrices = {}
                let months = Months()
                for(let p in prices){
                    let pArr = p.split('_')
                    const firstPartId = `${pArr[0]}_${pArr[1]}_`
                    let pPeriod = pArr[2].split('-')
                    if(newType == 'Месяц'){
                        if(type == 'День'){
                            let dayDate = pPeriod[0].split('.')
                            let monthPeriod = months[(dayDate[1]-1)][3]
                            monthPeriod = monthPeriod.split('-')
                            if(dayDate[1] == 2){
                                monthPeriod = new Date('29.02.'+dayDate[2]) ? monthPeriod[0]+'.'+dayDate[2]+'-'+monthPeriod[1]+'.'+dayDate[2] : '01.02.'+dayDate[2]+'-'+'28.02.'+dayDate[2]
                            }else{
                                monthPeriod = monthPeriod[0]+'.'+dayDate[2]+'-'+monthPeriod[1]+'.'+dayDate[2]
                            }
                            if(!newPrices[firstPartId+monthPeriod] || newPrices[firstPartId+monthPeriod] < prices[p]){
                                newPrices[firstPartId+monthPeriod] = prices[p]
                            }
                        }

                        if(type == 'Период'){
                            let from = pPeriod[0].split('.')
                            let to = pPeriod[1].split('.')
                            let monthFrom = from[1]
                            let monthTo = to[1]
                            let yearFrom = from[2]
                            let yearTo = to[2]
                            let monthPeriod = months[(monthFrom-1)][3]
                            monthPeriod = monthPeriod.split('-')
                            if(monthPeriod[1] == '29.02'){
                                const checkFeb = new Date(yearFrom+'-2-29')
                                if(checkFeb.getDate() === 1){
                                    monthPeriod[1] = '28.02'
                                }else{
                                    monthPeriod[1] = '29.02'
                                }
                            }
                            monthPeriod = monthPeriod[0]+'.'+yearFrom+'-'+monthPeriod[1]+'.'+ yearFrom
                            if(!newPrices[firstPartId+monthPeriod] || newPrices[firstPartId+monthPeriod] < prices[p]){
                                newPrices[firstPartId+monthPeriod] = prices[p]
                            }
                            monthPeriod = months[(monthTo-1)][3]
                            monthPeriod = monthPeriod.split('-')
                            if(monthPeriod[1] == '29.02'){
                                const checkFeb = new Date(yearTo+'-2-29')
                                if(checkFeb.getDate() === 1){
                                     monthPeriod[1] = '28.02'
                                }else{
                                     monthPeriod[1] = '29.02'
                                }
                            }
                            monthPeriod = monthPeriod[0]+'.'+yearTo+'-'+monthPeriod[1]+'.'+ yearTo
                            if(!newPrices[firstPartId+monthPeriod] || newPrices[firstPartId+monthPeriod] < prices[p]){
                                newPrices[firstPartId+monthPeriod] = prices[p]
                            }
                        }
                    }
                    if(newType == 'День'){
                        if(type == 'Месяц'){
                            let monthDateFrom = pPeriod[0].split('.')
                            let monthDateTo = pPeriod[1].split('.')
                            let monthMonth = monthDateFrom[1]
                            let monthYear = monthDateFrom[2]
                            for(let i = +(monthDateFrom[0]); i <= monthDateTo[0];i++){
                                const day = i < 10 ? `0${i}` : i
                                newPrices[`${firstPartId}${day}.${monthMonth}.${monthYear}-${day}.${monthMonth}.${monthYear}`] = prices[p]
                            }

                        }
                        if(type == 'Период'){
                            let days = DaysFromTo(pPeriod[0],pPeriod[1])
                            for(let day of days){
                                newPrices[`${firstPartId}${day}-${day}`] = prices[p]
                            }

                        }
                    }
                }

                if(Object.keys(newPrices).length) {
                    updateRoomsCalendarByPeriod(newPrices)
                }
            })
        }
    }
    renderCalendarTypeChanger(type){
        const { updateRoomsCalendarByPeriod } = this.props
        return (
            <div className="row">
                <div className="col-sm-2 ">
                    Тип календаря
                </div>
                <div className="col-sm-3">
                    {this.renderTypeSelect(type)}
                </div>
                <div className="col-sm-4">
                    <div className="warning-color shadow" style={{fontSize:'75%', padding:'5px 10px'}}>
                        Внимание! Изменение типа календаря приведёт к конвертации цен к новому виду. Отменить это действие будет невозможно.
                    </div>
                </div>
            </div>
        )
    }
    renderTypeSelect(type) {
        const {object} = this.props.activeObject
        if(object && object.PROPS.PAYMENT_TYPE['VALUE_XML_ID'] === 'percent'){
            return (
                <select className="form-control" value={type || 'Период'}
                        onChange={(e) => this.calendarTypeChange(e,type)}>
                    <option>День</option>
                    <option>Период</option>
                </select>
            )
        }else{
            return (
                <select className="form-control"
                    value={type || 'Период'}
                    onChange={(e) => this.calendarTypeChange(e,type)}>
                        <option>Период</option>
                        <option>Месяц</option>
                        <option>Выходные/Будни/Праздники</option>
                </select>
            )
        }
    }
    render() {
        const { prices, freeRoomsCount } = this.props
        const {roomsList, loading, error} =  this.props.rooms
        const { object } = this.props.activeObject;
        document.title = 'Календарь номеров'

        if(roomsList && roomsList.length && roomsList.length > 0) {
            if (object && object.PROPS.PAYMENT_TYPE['VALUE_XML_ID'] === 'percent') {
                return (
                    <div>
                        <Calendar type="Days" rooms={roomsList}
                                  onchange={this.props.updateRoomsCalendarByPeriod.bind(this)}
                                  onChangePriceType={this.onChangePriceType.bind(this)}
                                  onchangeFreeRoomsCount={this.props.updateRoomsCalendarByPeriod.bind(this)}
                                  freeRoomsCount={freeRoomsCount}
                                  prices={prices}
                        />
                        <PageText page={`calendar-help-${object.PROPS.PAYMENT_TYPE['VALUE_XML_ID'] || 'subscriber'}`}/>
                    </div>
                )
            } else if (object && object.PROPS.CALENDAR_TYPE['VALUE'] === 'Месяц'){
                return (
                    <div>
                        <ErrorBar error={error}/>
                        {this.renderCalendarTypeChanger(object && object.PROPS.CALENDAR_TYPE['VALUE'])}
                        <Calendar type="Months" rooms={roomsList} onchange={this.onchange.bind(this)} onChangePriceType={this.onChangePriceType.bind(this)} prices={this.props.prices}/>
                        <PageText page={`calendar-help-${object.PROPS.PAYMENT_TYPE['VALUE_XML_ID'] || 'subscriber'}`}/>
                    </div>
                )
            } else if (object && object.PROPS.CALENDAR_TYPE['VALUE'] === 'День') {
                return (
                    <div>
                        {this.renderCalendarTypeChanger(object && object.PROPS.CALENDAR_TYPE['VALUE'])}
                        <Calendar type="Days" rooms={roomsList}
                                  onchange={this.props.updateRoomsCalendarByPeriod.bind(this)}
                                  onChangePriceType={this.onChangePriceType.bind(this)} prices={this.props.prices}/>
                        <PageText page={`calendar-help-${object.PROPS.PAYMENT_TYPE['VALUE_XML_ID'] || 'subscriber'}`}/>
                    </div>
                )
            }else if(object && object.PROPS.CALENDAR_TYPE['VALUE'] === 'Выходные/Будни/Праздники'){
                return (
                    <div>
                        {this.renderCalendarTypeChanger(object && object.PROPS.CALENDAR_TYPE['VALUE'])}
                        <Calendar type="Weekdays" rooms={roomsList}  prices={this.props.pricesWeekdays} onchange={this.props.updateRoomsCalendarByWeekdays.bind(this)} onChangePriceType={this.onChangePriceType.bind(this)}/>
                        <PageText page={`calendar-help-${object.PROPS.PAYMENT_TYPE['VALUE_XML_ID'] || 'subscriber'}`}/>
                    </div>)
            } else {
                return (
                    <div>
                        {this.renderCalendarTypeChanger(object && object.PROPS.CALENDAR_TYPE['VALUE'])}
                        <Calendar
                            type="Period"
                            rooms={roomsList}
                            onchange={this.props.updateRoomsCalendarByPeriod.bind(this)}
                            onChangePriceType={this.onChangePriceType.bind(this)}
                            prices={this.props.prices}
                            periods={this.props.pricesPeriods}
                        />
                        <PageText page={`calendar-help-${object.PROPS.PAYMENT_TYPE['VALUE_XML_ID'] || 'subscriber'}`}/>
                        <ErrorBar error={error}/>
                    </div>
                )
            }
        }else {
            return <div><h3>Нет номеров</h3><Link to={'/lk/' + this.props.objectId + '/rooms/new'} className="btn red">Создать новый номер</Link></div>
        }
    }
}

export default RoomsCalendar