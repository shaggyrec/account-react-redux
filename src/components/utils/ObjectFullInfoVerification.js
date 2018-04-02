const verification = object => {
    return new Promise((resolve, reject)=>{
        let hasErrors = false
        let errors =  {}
        //console.log(object)
        if(object.PROPS.MORE_PHOTO.length == 0){
            hasErrors = true
            errors['checkPhotos'] = 'Не загружены фото'
        }
        if(!object.PROPS.NOMERA.VALUE.length || object.PROPS.NOMERA.VALUE.length == 0){
            hasErrors = true
            errors['checkRooms'] = 'Нет ни одного номера'
        }
        if(object.PROPS.CONTRACT_STAGE.VALUE !== 'Y'){
            hasErrors = true
            errors['checkContract'] = 'Необходимо заключить договор'
        }
        if(hasErrors){
            reject(errors)
        }
        resolve('ok')
    })
}

export default  verification