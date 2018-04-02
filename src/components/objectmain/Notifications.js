import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'react-router-dom'
import InfoCard from '../utils/InfoCard'

class Notifications extends Component {
    static contextTypes = {
        router: PropTypes.object
    }
    checkContract(stage){
        if(stage !== 'Y'){
            let message = {}
            if(stage === 'P'){
                message.title = "Договор составляется"
                message.text="Скоро мы закончим составление договора и вам нужно будет согласиться с условиями"
            } else if(stage === 'P'){
                message.title = "Подтвердите договор"
                message.text="Согласитесь с условиями договора, чтобы он скорее появился на сайте"
            } else{
                message.title = "Заключите договор"
                message.text="Пока договор не заключен, объект на сайте не появится"
            }

            return <InfoCard
                className="mb-1"
                color="warning-color"
                type='id-card-o'
                title={message.title}
                text={message.text}
                link={`/lk/${this.props.activeObjectId}/contract`}
            />
        }
    }
    checkPhotos(pics){
        if(!pics || pics.length == 0){
            return <InfoCard
                className="mb-1"
                color="warning-color"
                type='photo'
                title="Загрузите фото"
                text="Это повысит интерес потенциальных клиентов"
                link={`/lk/${this.props.activeObjectId}/photo`}
            />
        }
    }
    checkTempAnnoncePhoto(pic){
        if(isNaN(+(pic.VALUE))){
            return <InfoCard
                className="mb-1"
                color="warning-color"
                type='photo'
                title="Фото анонса не одобрено"
                text={`Причина: ${pic.VALUE}`}
                link={`/lk/${this.props.activeObjectId}/photo`}
            />
        }
    }
    checkRoomsPhotos(room){
        if(room){
            if(!room.PREVIEW_PICTURE) {
                return (
                    <InfoCard
                        className="mb-1"
                        color="warning-color"
                        type='photo'
                        title="Нет фото у номера"
                        text='Без фото номер отображаться на сайте не будет'
                        link={`/lk/${this.props.activeObjectId}/rooms/${room.ID}`}
                    />
                )
            }
        }
    }
    checkRoomsPrices(room){
        if(room && (!room.PROPS.PRICE_TABLE.VALUE[0].data_ot)){
            return <InfoCard
                className="mb-1"
                color="warning-color"
                type='rub'
                title="Нет цен у номера"
                text='Заполните таблицу цен, иначе номер не будет виден на сайте'
                link={`/lk/${this.props.activeObjectId}/rooms/calendar`}
            />
        }
    }
    render() {
        const { activeObject, activeRoom } = this.props
        if(activeObject) {
            return (
                <div className="notifications">
                    {this.checkPhotos(activeObject.PROPS.MORE_PHOTO)}
                    {this.checkTempAnnoncePhoto(activeObject.PROPS.TEMP_ANNONCE)}
                    {this.checkContract(activeObject.PROPS.CONTRACT_STAGE.VALUE)}
                    {this.checkRoomsPhotos(activeRoom)}
                    {this.checkRoomsPrices(activeRoom)}
                </div>
            )
        }else{
            return <div/>
        }
    }
}

export default Notifications