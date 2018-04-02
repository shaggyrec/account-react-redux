import React from 'react'
import moment from 'moment'
import 'moment/locale/ru'

moment.locale('ru')

const months = [
    ['январь', 'января','january','01.01-31.01',31],
    ['февраль', 'февраля','febrary','01.02-29.02',29],
    ['март', 'марта','march','01.03-31.03',31],
    ['апрель', 'апреля','april','01.04-30.04',30],
    ['май', 'мая','may','01.05-31.05',31],
    ['июнь', 'июня','june','01.06-30.06',30],
    ['июль', 'июля','july','01.07-31.07',31],
    ['август', 'августа','august','01.08-31.08',31],
    ['сентябрь', 'сентября','setpember','01.09-30.09',30],
    ['октябрь', 'октября','october','01.10-31.10',31],
    ['ноябрь', 'ноября','november','01.11-30.11',30],
    ['декабрь', 'декабря','december','01.12-31.12',31]
]
const weekdays = ["ВС","ПН","ВТ","СР","ЧТ","ПТ","СБ"]
const Now = new Date()
const dateFromRuToDate = (date) => {
    let dateArr = date.split('.')
    return new Date(dateArr[2],+(dateArr[1])-1, dateArr[0])
}
const date =  (date) => {
    return moment(date).format('ll')
}
const ruShortDate = (date) => {
    date = new Date(date)
    const day = date.getDate() < 10  ? '0' + date.getDate() : date.getDate()
    let month = +(date.getMonth())+1
    month = month < 10 ? '0' + month : month
    const year = date.getFullYear()

    return day + '.' + month + '.' + year
}
const MonthsToEndOfYear = () => {
    const now = new Date();
    const nowMonth = now.getMonth()
}
const Months = () => {
    return months
}
const MonthsFromNow = () => {
    let y = Now.getFullYear()
    let nextY = y+1
    let m = Now.getMonth()
    let d = Now.getDate()
    let result = {}
    const months = Months()
    result[y] = {}
    result[nextY] = {}
    for (let i = 0; i < 12; i++) {
        const month = months[i]
        let monthPeriod = month[3].split('-')
        if (i >= m) {
            result[y][i] = []
            result[y][i][0] = month[0]
            result[y][i][1] = month[1]
            result[y][i][2] = month[2]
            if (i == m) {
                d = d < 10 ? `0${d}` : d
                let curMonth = monthPeriod[0].split('.')[1]
                if(i === 1){
                    const checkFeb = new Date(y+'-2-29')
                    if(checkFeb.getDate() === 1){
                        monthPeriod[1] = '28.02'
                    }
                }
                result[y][i][3] = `${d}.${curMonth}.${y}-${monthPeriod[1]}.${y}`
            }else {
                result[y][i][3] = `${monthPeriod[0]}.${y}-${monthPeriod[1]}.${y}`
            }
            //console.log(result)
        }
        result[nextY][i]= []
        result[nextY][i][0] = month[0]
        result[nextY][i][2] = month[1]
        result[nextY][i][1] = month[2]
        if(i === 1){
            const checkFeb = new Date(y+'-2-29')
            if(checkFeb.getDate() === 1){
                monthPeriod[1] = '28.02'
            }else{
                monthPeriod[1] = '29.02'
            }
        }
        result[nextY][i][3] = monthPeriod[0] + '.' + nextY + '-' + monthPeriod[1] + '.' + nextY
    }
    return result
}
const DaysFromNow = () => {
    let y = Now.getFullYear()
    let m = Now.getMonth()
    let d = Now.getDate()
    let result = {}
    result[y] = {}
    result[y+1] = {}
    for(let i = 0; i < 12; i++){
        let month = i+1
        if(i >= m){
            result[y][month] = {}
        }
        //month = month < 10 ? '0' + month : month
        result[y+1][month] = {}
        for(let j = 1; j <= months[i][4];j++){
            //let day = j < 10  ? '0' + j : j
            if((i == m && j >= d) || (i > m)){
                let curDate = new Date(y,i,j)
                if(curDate.getDate() == j) {
                    result[y][month][j] = {
                        weekday:weekdays[curDate.getDay()],
                        weekdayNumber:curDate.getDay()
                    }
                }
            }
            let curDate = new Date(y+1,i,j)
            if(curDate.getDate() == j) {
                result[y + 1][month][j] = {
                    weekday:weekdays[curDate.getDay()]
                }
            }
        }
    }
    return result
}
const DaysFromTo = (from,to) => {
    if(!from || !to) return

    let fromArr = from.split('.')
    let toArr = to.split('.')
    let startD = parseInt(fromArr[0])
    let endD = parseInt(toArr[0])
    let startM = parseInt(fromArr[1])
    let endM = parseInt(toArr[1])
    let startY = parseInt(fromArr[2])
    let endY = parseInt(toArr[2])
    let result = []
    for(let i=startY; i<=endY;i++){
        let j=0
        for(let month of months){
            if (i == endY && (j + 1) > endM){
                break
            }
            let mo = (j+1) < 10 ? `0${(j+1)}` : (j+1)
            for(let k=1;k <= month[4];k++) {
                let day = k < 10 ? `0${k}` : k
                if (i == startY && (j + 1) < startM){
                    continue
                }
                if (i == startY && (j + 1) == startM && k < startD) {
                    continue
                }
                if (i == endY && (j + 1) == endM && k > endD) {
                    break
                }
                if(j==1 && k == 29){
                    let testDate = new Date(`${day}.${mo}.${i}`)
                    if(testDate == 'Invalid Date'){
                        continue
                    }
                }
                result.push(`${day}.${mo}.${i}`)
            }
            j++
        }
    }
    return result

}
export  {
    date,
    MonthsToEndOfYear,
    Months,
    Now,
    ruShortDate,
    dateFromRuToDate,
    DaysFromNow,
    MonthsFromNow,
    DaysFromTo
}