import React, { Component } from 'react'
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
const renderDayCell =({selected,price, id, onClick}) => {
        const classes = selected ? 'item Calendar__itemDay selected' : 'item Calendar__itemDay'
        // if(selected){
        //     return (
        //         <div className={classes}>
        //             <DebounceInput
        //                 type="number"
        //                 className="Calendar__input Calendar__d"
        //                 name={id}
        //                 min="0"
        //                 value={price}
        //                 onChange={e => {
        //                     {/*let prices = this.props.prices*/}
        //                     {/*let curPriceId = e.target.name*/}
        //                     {/*let curPriceOpts = curPriceId.split('_')*/}
        //                     {/*let newPrices = {}*/}
        //                     {/*for(let p in prices){*/}
        //                     {/*let pArr = p.split('_')*/}
        //                     {/*if(pArr[0] == curPriceOpts[0]) {*/}
        //                     {/*newPrices[p] = prices[p]*/}
        //                     {/*}*/}
        //                     {/*}*/}
        //                     {/*newPrices[curPriceId] = e.target.value*/}
        //                     {/*clearTimeout(timerId)*/}
        //                     {/*timerId = setTimeout((e) => this.props.onchange(newPrices), 500)*/}
        //                 }}
        //             />
        //         </div>
        //     )
        // }else{
        return(
            <div className={classes} onClick={onClick}>{price}</div>
        )
        // }
    }
const checkPropsChange = (props, nextProps) =>
    (nextProps.selected !== props.selected)

export default onlyUpdateForKeys(['selected','price'])(renderDayCell)